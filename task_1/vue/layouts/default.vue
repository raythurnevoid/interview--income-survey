<script setup lang="ts">
import { countryCodesContext } from "@/lib/contexts";
import "./app.css";
import { listenForSubmitFromOtherBrowserTabs } from "~/lib/browser-tabs-communication";

const res = await useFetch<string[]>("/api/countries/list");

countryCodesContext.set(res.data.value!);

const router = useRouter();

let currentPath = computed(() => router.currentRoute.value.path);
let nextPath = ref("");
let pathToHighlight = computed(() => nextPath.value || currentPath.value);

let scrollY = ref(0);
let innerHeight = ref(0);
let isInSurveysListPage = computed(() => currentPath.value === "/");
let shouldScrollTopButtonShow = computed(
	() => scrollY.value > innerHeight.value
);
let shouldShowRefreshDataButton = ref(false);

let unsubscribeFns: (() => any)[] = [];
onMounted(() => {
	{
		const unsubscribe = listenForSubmitFromOtherBrowserTabs(() => {
			if (!isInSurveysListPage.value) return;
			shouldShowRefreshDataButton.value = true;
		});
		unsubscribeFns.push(unsubscribe);
	}
	{
		function handleScroll() {
			scrollY.value = window.scrollY;
		}

		window.addEventListener("scroll", handleScroll);
		unsubscribeFns.push(() => {
			window.removeEventListener("scroll", handleScroll);
		});
	}
	{
		function handleResize() {
			innerHeight.value = window.innerHeight;
		}

		window.addEventListener("resize", handleResize);
		unsubscribeFns.push(() => {
			window.removeEventListener("resize", handleResize);
		});
	}
});

onUnmounted(() => {
	unsubscribeFns.forEach((fn) => fn());
});

router.beforeEach((to, from, next) => {
	console.log("beforeEach", to.path);
	nextPath.value = to.path;
	next();
});

router.afterEach(() => {
	nextPath.value = "";
});

function scrollToTop() {
	setTimeout(() => {
		// may conflict with user scroll
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, 100);
}

function handleRefreshDataClick() {
	scrollToTop();
	shouldShowRefreshDataButton.value = false;

	setTimeout(() => {
		// wait for the scroll to finish
		window.dispatchEvent(new CustomEvent("app:refresh-data"));
	}, 300);
}
</script>

<template>
	<div class="Layout">
		<header>
			<section>
				<nav>
					<ul>
						<li>
							<NuxtLink
								:class="{ current: pathToHighlight === '/' }"
								to="/"
								:inert="pathToHighlight === '/'"
							>
								List
							</NuxtLink>
						</li>
						<li>
							<NuxtLink
								:class="{ current: pathToHighlight === '/submit' }"
								to="/submit"
							>
								Submit
							</NuxtLink>
						</li>
					</ul>
				</nav>
				<section class="right">
					<div v-if="shouldShowRefreshDataButton">
						<span> New data is available: </span>
						<button class="secondary" @click="handleRefreshDataClick">
							<span>Refresh Data</span>
						</button>
					</div>
					<button
						v-if="shouldScrollTopButtonShow"
						class="secondary"
						@click="scrollToTop"
					>
						<span>Scroll To Top</span>
					</button>
				</section>
			</section>
			<div class="shadow"></div>
		</header>

		<section class="content">
			<slot />
		</section>
	</div>
</template>

<style scoped>
.Layout {
	display: contents;
	--header-height: 56px;
}

header {
	position: sticky;
	inset-block-start: 0;
	z-index: 1;
	background: var(--color--surface);
	height: var(--header-height);
	padding-inline-end: 16px;
}

nav,
ul,
li,
a,
header section {
	height: 100%;
}

header section,
ul {
	display: flex;
}

header section {
	justify-content: space-between;
}

a {
	display: flex;
	align-items: center;
	padding-inline: 16px;
	border-block-end: solid 4px transparent;
	color: var(--color--primary);

	&:hover {
		border-block-end-color: hsl(from var(--color--secondary) h s 80);
	}

	&:active {
		border-block-end-color: var(--color--secondary);
	}

	&.current {
		border-block-end-color: var(--color--secondary);
	}
}

.content {
	--content-margin: 16px;

	margin: var(--content--margin);
	min-height: calc(100dvh - var(--header-height) - var(--content-margin));
}

.right {
	display: flex;
	height: 100%;
	align-items: center;
	gap: 16px;
}
</style>

let channel: BroadcastChannel | null = null;
if (typeof window !== "undefined") {
	channel = new BroadcastChannel("app");
}

export function notifySubmitToOtherBrowserTabs() {
	if (channel) {
		channel.postMessage("submit");
	}
}

export function listenForSubmitFromOtherBrowserTabs(callback: () => void) {
	function handleMessage(event: MessageEvent) {
		if (event.data === "submit") {
			callback();
		}
	}

	if (channel) {
		channel.addEventListener("message", handleMessage);
	}

	return () => {
		if (channel) {
			channel.removeEventListener("message", handleMessage);
		}
	};
}

export function getDbCredentials() {
	const [dbHost, dbPort, dbUser, dbPassword, dbName] = [
		process.env.DB_HOST,
		Number(process.env.DB_PORT),
		process.env.DB_USER,
		process.env.DB_PASSWORD,
		process.env.DB_NAME,
	];

	if (!dbHost) throw new Error("DB_HOST is not set");
	if (!dbPort) throw new Error("DB_PORT is not set");
	if (Number.isNaN(dbPort)) throw new Error("DB_PORT is not a number");
	if (!dbUser) throw new Error("DB_USER is not set");
	if (!dbPassword) throw new Error("DB_PASSWORD is not set");
	if (!dbName) throw new Error("DB_NAME is not set");

	return {
		host: dbHost,
		port: dbPort,
		user: dbUser,
		password: dbPassword,
		database: dbName,
	};
}

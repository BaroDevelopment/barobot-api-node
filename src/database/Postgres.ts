import {Client, QueryResult} from 'pg'
import LOGGER from '../Logger'

/**
 * Singleton class
 */
export default class Postgres {

    private static instance: Client

    private constructor() {
    }

    static getInstance(): Client {

        if (!Postgres.instance) {
            const PG_CONNECTION_STRING = process.env.PG_CONNECTION_STRING || 'postgresql://postgres:postgres@localhost:5432/BaroBot'
            Postgres.instance = new Client(PG_CONNECTION_STRING);
        }

        return Postgres.instance
    }

    static async connect() {
        await Postgres.getInstance().connect()
            .then(() => LOGGER.getInstance().info(`Connected to Database`))
            .catch(e => Postgres.LOG_CONNECTION_ERR())
    }

    static LOG_CONNECTION_ERR = () => LOGGER.getInstance().error(`Unable to connect to the database. Please check your env var PG_CONNECTION_STRING`)

    static async run(query: string, args: any[]) {
        try {
            const result: QueryResult = await Postgres.getInstance().query(query, args)
            return result
        } catch (e) {
            LOGGER.getInstance().error('Failed to execute: ' + query)
            throw e
        }
    }
}
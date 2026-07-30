import mongoose from "mongoose";
import { config } from "../config/config.js";

const connections = {};

export function getTenantConnection(databaseName) {

    if (connections[databaseName]) {
        return connections[databaseName];
    }

    const connection = mongoose.createConnection(
        `${config.MONGO_URI}/${databaseName}`
    );

    connection.on("error", () => {
        delete connections[databaseName];
    });

    connection.on("disconnected", () => {
        delete connections[databaseName];
    });

    connections[databaseName] = connection;

    return connection;
}
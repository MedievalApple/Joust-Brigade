const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development", // or 'production' for production mode
    entry: {
        index: "./src/index.ts",
        joust: "./src/joust.ts",
        controls: "./src/controls.ts",
    },
    output: {
        filename: "[name].js", // Name of generated bundle after build
        path: path.resolve(__dirname, "build"),
        clean: true,
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./public/index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            filename: "joust.html",
            template: "./public/joust.html",
            chunks: ["joust", "controls"],
        }),
    ],
};

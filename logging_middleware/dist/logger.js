"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
function Log(stack, level, packageName, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = {
            stack,
            level,
            packageName,
            message,
            timestamp: new Date().toISOString(),
        };
        try {
            yield axios_1.default.post(constants_1.TEST_SERVER_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }
        catch (error) {
            /**
             * Intentionally avoiding console.log
             * Silent fail or future local persistence can be added here
             */
        }
    });
}

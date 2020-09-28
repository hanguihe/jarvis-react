import { resolve } from "path";
import { prompt } from "inquirer";
import { cyan } from "chalk";
import ora from "ora";

/**
 * @description 终端交互 - 询问
 * @param message
 * @return Promise<Boolean>
 */
export async function confirm(message: string) {
  const { answer } = await prompt([
    {
      type: "confirm",
      name: "answer",
      message,
      default: true,
    },
  ]);

  return answer;
}

/**
 * 打印信息
 */
export const logger = {
  cyan: (text: string) => {
    console.log(cyan(text));
  },
  success: (text: string) => {
    return ora().succeed(text);
  },
};

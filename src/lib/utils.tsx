import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const randomId = () => Math.random().toString(36).substr(2, 9)

export function humanFileSize(size: number) {
  if (size > 0) {
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      ["B", "kB", "MB", "GB", "TB"][i]
    )
  }
  return "0.00MB"
}

export function cosineSimilarity(v1: number[], v2: number[]) {
  if (v1.length !== v2.length) {
    return -1
  }
  let dotProduct = 0
  let v1_mag = 0
  let v2_mag = 0
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i]
    v1_mag += v1[i] ** 2
    v2_mag += v2[i] ** 2
  }
  return dotProduct / (Math.sqrt(v1_mag) * Math.sqrt(v2_mag))
}

export function zip(...arrays: any[]) {
  return arrays[0].map((_: any, i: string | number) =>
    arrays.map((array: { [x: string]: any }) => array[i]),
  )
}
export function wrapArray(value: any) {
  return Array.isArray(value) ? value : [value]
}


export function registerTag(
  engine,
  key: string,
  fn: (value: any, emitter: Emitter) => void,
) {
  engine.registerTag(
    key,
    class extends Tag {
      private value: Value
      constructor(
        token: TagToken,
        remainTokens: TopLevelToken[],
        liquid: Liquid,
      ) {
        super(token, remainTokens, liquid)
        this.value = new Value(token.args, liquid)
      }
      async render(ctx: Context, emitter: Emitter) {
        const value = await toPromise(this.value.value(ctx))
        fn(value, emitter)
      }
    },
  )
}

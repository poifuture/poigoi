import Base32Encode from "base32-encode"

export type PoiUserId = string & { readonly brand: "PoiUserId" }

export const GenerateId: () => Promise<PoiUserId> = async () => {
  const seed = new Uint32Array(10)
  if (!!window && !!window.crypto && !!window.crypto.getRandomValues) {
    window.crypto.getRandomValues(seed)
  } else {
    //polyfill IE
    for (let i = 0; i < 10; i++) {
      seed[i] = Math.random() * 0xffff
    }
  }
  // Little Endian
  const timestamp = new Date().getTime()
  seed[0] = timestamp >>> 0
  seed[1] = (timestamp / 2 ** 32) >>> 0
  const tmpPoiUserId = Base32Encode(seed.buffer, "RFC4648", { padding: false })
  console.debug("Generated poiUserId: ", tmpPoiUserId, " seed: ", seed)
  return tmpPoiUserId as PoiUserId
}

export default { GenerateId }

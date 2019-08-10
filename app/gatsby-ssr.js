import i18n from "i18next"
import SyncBackend from "i18next-sync-fs-backend"
i18n.use(SyncBackend)

import { WrapRootElementFunction, ReplaceRenderer } from "./src/GatsbyInterface"

export const wrapRootElement = WrapRootElementFunction
export const replaceRenderer = ReplaceRenderer

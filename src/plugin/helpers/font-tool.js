import tryParseJSON from "helpers/try-parse-json.js";
import csInterface from "helpers/cs-interface.js";
import TypeFace from "datatypes/typeface.js";
import { info } from "helpers/logger.js";


/** applyTypeface
 * 
 * @param {TypeFace} typeface 
 * @param {Typeface.variant} variant 
 */
export const applyTypeface = async (typeface, variant = null) => {

  const { postScriptName, style } = TypeFace.getPostScriptName(typeface, variant);


  const result = await new Promise((resolve, reject) => {
    info(` applying ("${typeface.family}", "${postScriptName}", "${style}")`, typeface, "font-tool");
    // previously called applyTypefaceByPostScriptName
    csInterface.evalScript(`setFont("${typeface.family}", "${postScriptName}", "${style}")`, (result) => {
      let response = tryParseJSON(result);
      resolve(response);
    });

  });
  
  return result;
}

/**
 * 
 */
export const refreshPhotoshopFonts = async () => {
  
  const result = await new Promise((resolve, reject) => {

    csInterface.evalScript(`refreshPhotoshopFonts()`, (result) => {
      let response = tryParseJSON(result);
      resolve(response);
    });

  });

  return result;
}
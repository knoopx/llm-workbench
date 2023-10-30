import mammoth from "mammoth/mammoth.browser"

function readFileInputEventAsArrayBuffer(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const arrayBuffer = e.target.result
      resolve(arrayBuffer)
    }
    reader.readAsArrayBuffer(file)
  })
}

async function extractWithMammoth(file: File) {
  const arrayBuffer = await readFileInputEventAsArrayBuffer(file)
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

// import pdfParse from "pdf-parse"
const pdfjs = await import("pdfjs-dist/build/pdf")
const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry")
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

async function extractWithPDFParse(file: File) {
  async function getDoc(file) {
    const arrayBuffer = await readFileInputEventAsArrayBuffer(file)
    const result = await pdfjs.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    }).promise
    return result
  }

  const doc = await getDoc(file)
  const meta = await doc.getMetadata().catch(() => null)

  let text = ""
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()

    if (content.items.length === 0) {
      continue
    }

    text += content.items.map((item) => item.str).join("")
  }

  return text
}

async function _processFile(file: File) {
  if (file.name.endsWith(".docx")) {
    return extractWithMammoth(file)
  } else if (file.name.endsWith(".pdf")) {
    return extractWithPDFParse(file)
  } else if (file.type.startsWith("text/")) {
    return file.text()
  }
}

function stripNonPrintableAndNormalize(
  text: string,
  stripSurrogatesAndFormats = true,
) {
  // strip control chars. optionally, keep surrogates and formats
  if (stripSurrogatesAndFormats) {
    // text = text.replace(/\p{C}/gu, "")
  } else {
    // text = text.replace(/\p{Cc}/gu, "")
    text = text.replace(/\p{Co}/gu, "")
    text = text.replace(/\p{Cn}/gu, "")
  }

  // other common tasks are to normalize newlines and other whitespace

  // normalize newline
  text = text.replace(/\n\r/g, "\n")
  text = text.replace(/\p{Zl}/gu, "\n")
  text = text.replace(/\p{Zp}/gu, "\n")

  // normalize space
  return text.replace(/\p{Zs}/gu, " ")
}

async function processFile(file: File) {
  const text = await _processFile(file)
  return stripNonPrintableAndNormalize(text)
}

export async function processFiles(files: FileList) {
  const results = await Promise.all(Array.from(files).map(processFile))
  return results.filter(Boolean)
}

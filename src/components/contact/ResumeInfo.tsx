import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'
import printJS from 'print-js'

const Resume = process.env.PUBLIC_URL + '/assets/Resume.pdf'

function ResumeInfo() {
  return (
    <div className='ResumeInfo'>
      <div className={'ResumeInfoName'}>Resume</div>
      <div onClick={() => printJS(Resume)} className='pdfRender'>
        <Document file={Resume} renderMode='canvas'>
          <Page pageNumber={1} height={500} renderMode='canvas' renderTextLayer={false} />
        </Document>
      </div>
    </div>
  )
}

export default ResumeInfo

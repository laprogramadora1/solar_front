'use client';


const PdfPage = () => {
  const URL_MEDIA = process.env.path;
  return (<div>

    <object data={URL_MEDIA + "pdf/paper.pdf"} type="application/pdf" width="100%" height="700px" >
      <p>Unable to display PDF file. <a href="sample.pdf">Download</a> instead.</p>
    </object>
  </div>);
}
export default PdfPage;
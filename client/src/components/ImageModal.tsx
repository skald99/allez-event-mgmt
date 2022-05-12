import React, { useEffect } from "react";
import {useDropzone} from "react-dropzone";


type ImageData = {
    previewImgs: () => void
}


const ImageModal = ({previewImgs = () => {}} : ImageData) => {

    const [files, setFiles] = React.useState<Array<{preview: string, name: string}>>([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        },
        
    });

    const thumbnail = files.map(file => (
        <div key={file.name} className="inline-flex rounded-sm border border-blue-300 mb-5 mr-5 w-48 h-36 object-contain p-4 box-border">
            <div className="flex min-w-0 overflow-hidden">
                <img src={file.preview} alt={file.name} className="block w-auto h-full" onLoad={() => {URL.revokeObjectURL(file.preview)}}/>
            </div>
        </div>
    ));

    useEffect(() => {
        return() => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files])
    return (
        <div className="relative bg-slate-100 rounded-lg shadow dark:bg-gray-700">
            <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="imageModal">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
            </button>
            <div className="py-6 px-6 lg:px-8">
                <h1 className="font-bold text-xl font-sans text-gray-600">Upload your Images</h1>
                <div {...getRootProps({className: "h-40 border border-blue-300 mt-6 w-full"})}>
                    <input {...getInputProps()} />
                    <p>Drag and drop your files, or click to select.</p>
                </div>
                <aside className="flex flex-row flex-wrap m-8">
                    {thumbnail}
                </aside>
            </div>
        </div>
    )
}

export default ImageModal;
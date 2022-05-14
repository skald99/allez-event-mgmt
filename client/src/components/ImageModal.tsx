import React, { useEffect } from "react";
import {useDropzone} from "react-dropzone";


type ImageDetails = {
    file: File
    preview: string

}

const ImageModal = (props: { previewImgs: (files: File[]) => void; hideModal: () => void}) => {

    const [files, setFiles] = React.useState<ImageDetails[]>([]);
    
    const {getRootProps, getInputProps, isDragReject, isDragActive, isDragAccept} = useDropzone({
        accept: {
            'image/*': []
        },
        multiple: true,
        onDrop: acceptedFiles => {
            let imgs: ImageDetails[] = []
            acceptedFiles.forEach(file => {
                let fImage: ImageDetails = {
                    file: file,
                    preview: URL.createObjectURL(file)
                }
                imgs.push(fImage);
            })
            setFiles([...files,...imgs]);
        },
        
    });


    const removeImage = (image: ImageDetails) => () => {
        const newFiles = [...files]
        newFiles.splice(newFiles.indexOf(image), 1)
        setFiles(newFiles)
      }
    
    
      const removeAllImages = () => {
        setFiles([]);
    }
    
    
    const thumbnail = files.map((file) => (
        <div key={file.file.name} className="rounded-sm border border-blue-300 mb-5 mr-5 w-52 h-40 p-1 flex flex-col justify-between">
            <div className="min-w-0 overflow-hidden flex justify-center">
                <img src={file.preview} alt={file.file.name} className="block w-auto h-full" onLoad={() => {URL.revokeObjectURL(file.preview)}}/>
            </div>
            <button type="button" className="bg-red-500 w-full text-white font-sans text-sm rounded p-2 mt-1" onClick={removeImage(file)}>Remove</button>
        </div>
    ));
    
    useEffect(() => {
        return() => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files])


    return (
        <div className="relative bg-zinc-50 rounded-lg shadow-lg dark:bg-gray-700">
            <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => {
                if(files.length === 0) {
                    removeAllImages()
                }
                props.hideModal()
            }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>  
            </button>
            <div className="py-6 px-6 lg:px-8">
                <h1 className="font-bold text-xl font-sans text-gray-600">Upload your Images</h1>
                <div {...getRootProps({className: `h-40 border-2 ${isDragActive && "border-blue-300"} mt-6 w-full ${isDragReject && "border-red-400"} ${isDragAccept && "border-green-300"}`})}>
                    <input {...getInputProps()} />
                    <p>Drag and drop your files, or click to select.</p>
                </div>
                <aside className="flex flex-row flex-wrap m-8">
                    {thumbnail}
                </aside>
                    { files.length > 0 &&
                        <div className="grid grid-cols-2">
                            <div>
                                <button type="button" className="bg-red-700 mx-4 py-2 px-20 text-gray-100 font-sans mt-2 rounded-md align-bottom hover:bg-red-900" onClick={removeAllImages}>Remove All</button>
                            </div>
                            <div>
                            <button type="button" className="bg-blue-500 mx-4 py-2 px-24 text-gray-100 font-sans mt-2 rounded-md align-bottom hover:bg-blue-700" onClick={() => {
                                let images: File[] = [];
                                files.forEach(file => {
                                    images.push(file.file);
                                })
                                props.previewImgs(images);
                                props.hideModal();
                            }}>Upload</button>
                            </div>
                        </div>
                    }
            </div>
        </div>
    )
}

export default ImageModal;
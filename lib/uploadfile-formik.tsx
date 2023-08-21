/* eslint-disable @next/next/no-img-element */
import { FormikErrors } from "formik";
import { useMemo, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ApiUrl } from "@/public/app-setting";
import { AiFillDelete } from "react-icons/ai";
import { MdDownload } from "react-icons/md";
import { useFormikContext } from "formik";
interface FormatDropzone {
  errors?: FormikErrors<{ fileAttachs?: any }>;
  fileType: string;
  maxFiles: number;
  action: string;
  onDataUpdate?: any;
  data: any[];
  displayImage?: any;
  nameAttach: string;
  nameDelete: string;
  loading:any;
}

const baseStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#2196f3",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#2196f3",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export const UploadFile = ({
  errors,
  fileType,
  maxFiles,
  action,
  data,
  displayImage,
  nameAttach,
  nameDelete,
  loading,
}: FormatDropzone) => {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {}, // file type hợp lệ
    noClick: true,
    noKeyboard: true,
    maxFiles: maxFiles, // max files được upload
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      configFile(acceptedFiles);
    },
  });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );
  const { setFieldValue } = useFormikContext();
  //danh sách file có trong component bao gồm file lỗi
  const [innerValue, setInnerValue] = useState<any[]>([]);
  //danh sách file có trong component không bao gồm file lỗi
  const [fileAttach, setfileAttach] = useState<any[]>();
  const [lstIdDelete, setlstIdDelete] = useState<any[]>([]);
  const [errorMaxFiles, setErrorMaxFiles] = useState(false);
  const lstTypeFile = getTypeFile(fileType);
  const maxSize = 50;
  useEffect(() => {
    if (data){
      setInnerValue([...data]);
    }
  }, [loading]);
  /**
   *
   * @param file lấy danh sách định dạng file được dùng
   * @returns
   */
  function getTypeFile(file: string) {
    switch (file) {
      case "fileImage":
        return ["jpg", "jpeg", "png"];
      case "fileDocument":
        return ["doc", "docx", "xls", "xlsx", "pdf"];
      default:
        return [];
    }
  }

  function onChangeHandler(event: any) {
    let files: File[] = new Array<File>();
    files = event.target.files;
    configFile(files);
  }

  function configFile(files: any) {
    let totalFiles = [...files];

    // check file type hợp lệ
    let totalArr = Array.from(totalFiles).map((file: any) => {
      file.filetype = file.name.split(".").pop();
      file.title = file.name;
      file.error = new Array();
      if (checkFileType(file.filetype) !== "")
        file.error.push(checkFileType(file.name.split(".").pop()));
      if (checkSize(file.size) !== "") file.error.push(checkSize(file.size));
      return file;
    });
    // check nếu tồn tại rồi xóa file cũ thay thế file mới
    if (action == 'add' && innerValue) {
           innerValue?.forEach((element) => {
        if (totalArr.filter(file => file.name === element.name).length == 0)
          totalArr.push(element);
      });
    }
    //trong trường hợp sửa sẽ vẫn thêm file mới
    else{
      innerValue?.forEach((element) => {
        totalArr.push(element);
      });
    }
      //arr.map(x => {
      //    if (this.state.innerValue.indexOf(x) > -1)
      //        delete this.state.innerValue[this.state.innerValue.indexOf(x)];
      //})
        
      let arrRe = new Array();
      totalArr.map((x) => {
        if ((!x.error || (x.error && x.error.length == 0)))
          arrRe.push(x);
      });
      if (arrRe.length > maxFiles) {
        setErrorMaxFiles(true);
      } else {
        setErrorMaxFiles(false);
        setFieldValue(nameAttach, arrRe);
        setInnerValue([...totalArr]);
        setfileAttach([...arrRe]);
      }
    }
    function checkSize(size: any) {
      if (maxSize * 1000000 >= size) return "";
      else return "Dung lượng file vượt quá cho phép";
    }
    // xóa file
    function deleteFiles(e: any) {
      var array = innerValue;
      let idsDelete = lstIdDelete;
      var index = array?.indexOf(e);
      if (index !== -1 && array !== undefined) {
        if (array[index].id)
          idsDelete.push(array[index].id);
        array.splice(index, 1);
      }

      let arrRe = new Array();
      array.map((x) => {
        if (!x.error || (x.error && x.error.length == 0))
         arrRe.push(x);
      });
      if (arrRe.length > maxFiles) {
        setErrorMaxFiles(true);
      } else {
        setErrorMaxFiles(false);
      }
      setInnerValue([...array]);
      setfileAttach([...arrRe]);
      setlstIdDelete([...lstIdDelete]);
      setFieldValue(nameAttach, arrRe);
      setFieldValue(nameDelete, lstIdDelete);
    }
  

  // check file type hợp lệ
  function checkFileType(file: string): string {
    if (lstTypeFile.indexOf(file.toLowerCase()) > -1) return "";
    else return "Định dạng file không được phép tải lên";
  }

  const onDownload = async (url: any) => {
    // let res = await userServices.gettime();
     let a = document.createElement("a");
    // a.href = ApiUrl + url + "/" + res;
    a.href = ApiUrl + url;
    a.target = "_blank";
    a.click();
  };
  return (
    <section className="container">
      <div {...getRootProps({ style })}>
        <p className="mb-2 text-gray-500 text-xs">
          (Định dạng cho phép: {lstTypeFile.toString()})
        </p>
        {action == "add" || action == "edit" ? (
          <button
            type="button"
            className="bg-green-400 cursor-pointer flex hover:bg-green-500 px-5 py-2 text-sm leading-5 rounded-md font-semibold text-white"
          >
            <label id="file-input-label" htmlFor="file-input">
              Thêm tệp
            </label>
          </button>
        ) : (
          <></>
        )}
        <input
          type="file"
          id="file-input"
          name={nameAttach}
          className="hidden"
          onChange={(e) => {
            onChangeHandler(e);
          }}
          multiple={maxFiles > 1 ? true : false}
        />
        <hr />
        <ul>
          <div className="grid grid-cols-2 gap-4">
            {innerValue?.map((file: any, index) => {
              return (
                <li
                  className=""
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {
                    <>
                      <p style={{ margin: "0px", marginLeft: "10px" }}>
                        {file.title}
                      </p>
                      {action == "add" || action == "edit" ? (
                        <>
                          <button
                            type="button"
                            className="ml-1"
                            style={{ color: "red" }}
                            onClick={() => deleteFiles(file)}
                          >
                            <AiFillDelete />
                          </button>
                          <small style={{ color: "red", marginLeft: "10px" }}>
                            {file.error?.map((err: any, index: any) => {
                              return <span key={index}>{err} </span>;
                            })}
                          </small>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="ml-1"
                          onClick={() => onDownload(file.url)}
                        >
                          <MdDownload />
                        </button>
                      )}
                    </>
                  }
                </li>
              );
            })}
          </div>
          <div>
            {errorMaxFiles == true ? (
              <p style={{ color: "red" }}>
                Số file tải lên vượt quá mức quy định!
              </p>
            ) : (
              ""
            )}
          </div>
        </ul>
      </div>
    </section>
  );
};

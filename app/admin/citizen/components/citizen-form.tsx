"use client";
import { IFormProps } from "@/shared/model";
import { Modal } from "@/shared/components/modal";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { TanetInput, TanetRadioCheck, TanetCheckbox, TanetTextArea, TanetSelect, SelectAsync, TanetFormDate, TanetCKEditor, UploadFile } from "@/lib";
import { useEffect, useState, useReducer } from "react";
import { array, number, object, ref, string, date } from "yup";
import { citizenServices } from "../services";
import { formReducer, INITIAL_STATE_FORM, computedTitle } from "@/lib/common";
export default function CitizenForm({
  show,
  action,
  id,
  onClose,
}: IFormProps) {
  const titleTable = "Thông tin cư dân";
  const dataDefault = {
    apartmentCode: '',
    dateOfBirth: null,
    fullName: '',
    gender: '',
    isStayed: false,
    ownerGeneration: null,
    ownerId: null,
    relationShip: null,
    relationShipCheck: null,
    urbanId: null,
    career:'',
    citizenCode:'',
    email:'',
    identityNumber:'',
    phoneNumber:'',
  };
  const schema = object({
    urbanId: number().nullable().required('Trường này là bắt buộc'),
    apartmentCode: string().nullable().required('Trường này là bắt buộc'),
    fullName: string().trim().nullable().required('Trường này là bắt buộc'),
    gender: string().trim().nullable().required('Trường này là bắt buộc'),
    dateOfBirth: date().nullable().required('Trường này là bắt buộc'),
  });
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE_FORM);
  const { data, error, isLoading, mutate } = citizenServices.GetById(id!);
  const { data: dataCanHos } = citizenServices.GetCanHo()
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: any) => {
    setLoading(true);
    if (id) {
      try {
        await citizenServices.createOrUpdate(values);
        toast.success("Cập nhật thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Cập nhật không thành công");
      }
    } else {
      try {
        await citizenServices.createOrUpdate(values);
        toast.success("Thêm thành công");
        await mutate();
        await onClose(true);
      } catch (err: any) {
        toast.error("Thêm mới không thành công");
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    dispatch({ type: action });
  }, [action, id]);
  const dataUrBans = [
    {
      label: 'Keangnam',
      value: 692,
    },
    {
      label: 'Nam cuong',
      value: 754,
    }

  ];
  const dataGioiTinhs = [
    {
      label: "Nam",
      value: "Nam",
    },
    {
      label: "Nữ",
      value: "Nữ",
    }
  ];
  const dataChuNhaTVs = [
    {
      label: "Chủ hộ",
      value: true,
    },
    {
      label: "Thành viên",
      value: false,
    }
  ];
  const dataQuanHes = [
    {
      label: "Vợ",
      value: 1,
    },
    {
      label: "Chồng",
      value: 2,
    },
    {
      label: "Con gái",
      value: 3,
    },
    {
      label: "Con trai",
      value: 4,
    },
    {
      label: "Họ hàng",
      value: 5,
    },
    {
      label: "Cha",
      value: 6,
    },
    {
      label: "Mẹ",
      value: 7,
    },
    {
      label: "Ông",
      value: 8,
    },
    {
      label: "Bà",
      value: 9,
    },
    {
      label: "Khách",
      value: 10,
    }
  ];

  return (
    <>
      <Modal show={show} size="xl" loading={loading}>
        <Formik
          onSubmit={(values) => {
            onSubmit(values);
          }}
          validationSchema={schema}
          initialValues={data ? data : dataDefault}
          enableReinitialize={true}
        >
          {({ handleSubmit, values }) => (
            <Form noValidate
              onSubmit={handleSubmit}
              onKeyPress={(ev) => {
                ev.stopPropagation();
              }}>
              <Modal.Header onClose={onClose}>{computedTitle(id, state?.editMode, titleTable)}</Modal.Header>
              <Modal.Body nameClass="grid-cols-12">
                <div className='col-span-12'>
                  <TanetSelect
                    label="Khu đô thị"
                    required={true}
                    className="block mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="urbanId"
                    id="urbanId"
                    view={state?.viewMode}
                    options={dataUrBans}
                  />
                </div>
                <div className='col-span-12'>
                  <TanetSelect
                    label="Mã căn hộ"
                    required={true}
                    className="block mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="apartmentCode"
                    id="apartmentCode"
                    view={state?.viewMode}
                    options={dataCanHos}
                  />
                </div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Họ và tên'
                    required={true}
                    view={state?.viewMode}
                    id='fullName'
                    name='fullName'
                  /></div>
                <div className='col-span-6'>
                  <TanetFormDate
                    label='Ngày sinh'
                    required={false}
                    view={state?.viewMode}
                    dateFormat='dd/MM/yyyy'
                    id='dateOfBirth'
                    name='dateOfBirth'
                  /></div>
                <div className='col-span-6'>
                  <TanetSelect
                    label="Giới tính"
                    required={true}
                    className="block mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="gender"
                    id="gender"
                    view={state?.viewMode}
                    options={dataGioiTinhs}
                  />
                </div>
                {/* <div className='col-span-6'>
                  <TanetSelect
                    label="Chủ nhà/thành viên"
                    required={true}
                    className="block mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="isStayed"
                    id="isStayed"
                    view={state?.viewMode}
                    options={dataChuNhaTVs}
                  />
                </div> */}
                <div className='col-span-12'>
                <TanetRadioCheck
                    label="Chủ nhà/thành viên"
                    required={true}                    
                    name="isStayed"
                    id="isStayed"
                    view={state?.viewMode}
                    data={dataChuNhaTVs}
                  />
                </div>
                {!values.isStayed && <>
                  
                  <div className='col-span-6'>
                    <TanetSelect
                      label="Quan hệ với chủ hộ"
                      //required={true}
                      className="block mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      name="relationShip"
                      id="relationShip"
                      view={state?.viewMode}
                      options={dataQuanHes}
                    />
                  </div>
                  <div className='col-span-6'>
                    <TanetSelect
                      label="Tên chủ hộ"
                      //required={true}
                      className="block mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      name="relationShip1"
                      id="relationShip1"
                      view={state?.viewMode}
                      options={[]}
                    />
                  </div>
                </>}

                <div className='col-span-12'>
                  <TanetInput
                    label='Email'
                    required={false}
                    view={state?.viewMode}
                    id='email'
                    name='email'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Số điện thoại'
                    required={false}
                    view={state?.viewMode}
                    id='phoneNumber'
                    name='phoneNumber'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Nghề nghiệp'
                    required={false}
                    view={state?.viewMode}
                    id='career'
                    name='career'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='Mã cư dân'
                    required={false}
                    view={state?.viewMode}
                    id='citizenCode'
                    name='citizenCode'
                  /></div>
                <div className='col-span-12'>
                  <TanetInput
                    label='CMND/CCCD'
                    required={false}
                    view={state?.viewMode}
                    id='identityNumber'
                    name='identityNumber'
                  /></div>




              </Modal.Body>
              <Modal.Footer onClose={onClose}>
                {!state?.viewMode ? (
                  <>
                    <button
                      data-modal-hide="large-modal"
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Lưu
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

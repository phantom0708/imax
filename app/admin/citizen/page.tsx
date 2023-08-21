"use client";
import { GridView } from "@/shared/components/data-grid";
import { DefaultMeta, DefaulPer } from "@/public/app-setting";
import { toast } from "react-toastify";
import {
  handleChangeAction,
  delAction,
  listReducer,
  getPermisson,
  INITIAL_STATE_LIST,
  ACTION_TYPES,
  formatDateTime
} from "@/lib/common";
import { useReducer, useState, useEffect } from "react";
import { citizenServices } from "./services";
import {
  AiOutlinePlus,
  AiFillEdit,
  AiFillDelete,
  AiTwotoneEye,
} from "react-icons/ai";
import CitizenForm from "./components/citizen-form";
import ConfirmationDialog, { confirm } from "@/shared/components/confirm";
export default function Page() {
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const titleTable = "Thông tin cư dân";
  const { data, isLoading, mutate } = citizenServices.GetList(meta);
  const [state, dispatch] = useReducer(listReducer, INITIAL_STATE_LIST);
  const actions = {
    meta,
  };
  const handleChange = (res: any) => {
    const newMeta = handleChangeAction(res, actions);
    if (newMeta) {
      setMeta({
        ...meta,
        newMeta,
      });
    }
  };
  const onClose = async (isRefresh: boolean) => {
    dispatch({ type: ACTION_TYPES.CLOSE });
    if (isRefresh) {
      await mutate();
    }
  };
  
  const actDelete = async (
    item: any,
    data: any,
    setMeta: any,
    meta: any,
    mutate: any
  ) => {
    confirm("Bạn có chắc chắn muốn xóa?", async () => {
      try {
        await citizenServices.delete(item.id);
        toast.success("Xóa thành công");
        if (data?.data.length === 1 && data.currentPage !== 1) {
          setMeta({
            ...meta,
            page: data?.currentPage - 1,
          });
        } else await mutate();
      } catch (err) {
        toast.error("Xóa thất bại");
      }
    });
  };
  useEffect(() => {
    setPermisson(getPermisson("Citizen"));
  }, []);
  return (
    <>
      <GridView
        title={"Danh sách " + titleTable}
        handleChange={handleChange}
        loading={isLoading}
      >
        <GridView.Header
          keySearch={meta.search}
          meta={meta}
          ActionBar={
            <button
              className="btn-add"
              onClick={() => dispatch({ type: ACTION_TYPES.ADD, Id: 0 })}
            >
              <AiOutlinePlus className="text-[20px]" /> Thêm mới
            </button>
          }
        ></GridView.Header>
        <GridView.Table
          className="col-12"
          data={data?.data}
          keyExtractor={({ item }) => {
            return item.id;
          }}
          page={meta.page}
          page_size={meta.page_size}
          total={data?.totalRecords}
          noSelected={true}
        >
          <GridView.Table.Column
            style={{ width: "3%" }}
            title="STT"
            className="text-center"
            body={({ index }) => (
              <span>{index + 1 + (meta.page - 1) * meta.page_size}</span>
            )}
          />
          <GridView.Table.Column
            style={{}}
            title="Họ tên"
            sortKey="fullName"
            body={({ item }) => <span>{item.fullName}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Dự án"
            sortKey="tieuDe"
            body={({ item }) => <span>{item.urbanName}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Mã căn hộ"
            sortKey="apartmentCode"
            body={({ item }) => <span>{item.apartmentCode}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Ngày sinh"
            sortKey="dateOfBirth"
            body={({ item }) => <span>{formatDateTime(item.dateOfBirth)}</span>}
          />
          <GridView.Table.Column
            style={{}}
            title="Giới tính"
            sortKey="gender"
            body={({ item }) => <span>{item.gender}</span>}
          />
          <GridView.Table.Column
            style={{ width: "10%" }}
            className="view-action"
            title="Tác vụ"
            body={({ item }) => (
              <div className="flex flex-row">
                <AiTwotoneEye
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Xem chi tiết"
                  onClick={() =>
                    dispatch({ type: ACTION_TYPES.READ, Id: item.id })
                  }
                />
                <AiFillEdit
                  className="cursor-pointer text-lg mr-1 text-blue-800"
                  title="Chỉnh sửa"
                  onClick={() =>
                    dispatch({ type: ACTION_TYPES.EDIT, Id: item.id })
                  }
                />
                <AiFillDelete
                  className="cursor-pointer text-lg mr-1 text-red-700"
                  title="Xóa"
                  onClick={() =>
                    actDelete(
                      item,
                      data,
                      setMeta,
                      meta,
                      mutate
                    )
                  }
                />
              </div>
            )}
          />
        </GridView.Table>
      </GridView>
      <CitizenForm
        show={state.show}
        onClose={onClose}
        action={state.action}
        id={state.Id}
      />
      <ConfirmationDialog />
    </>
  );
}

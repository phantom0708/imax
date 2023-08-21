'use client'
import { useState, useRef, Children, useContext } from "react";
import { Pagination } from "./grid-pagination";
import { GridViewContext } from "./grid-view";
import { defaultGrid } from "../../../public/app-setting";
import { IColumnProps, ITableProps } from "../../model";
import { AiOutlineCaretUp, AiOutlineCaretDown, AiOutlineFilter, AiOutlineMore } from "react-icons/ai";
import OptionHeader from "./option-header";
import ToggleVisibility from "./toggleVisibility";


export const Column = ({
  className,
  title,
  body,
  sortKey,
  children,
  typeColumn,
  filterName,
}: IColumnProps) => {
  return <> </>;
};

export const Table = ({
  className,
  data,
  sort,
  keyExtractor,
  noSelected,
  page,
  page_size,
  total,
  pageSizeOptions = defaultGrid.pageSizeOptions,
  handleChange,
  children
}: ITableProps) => {
  const contextValue = useContext(GridViewContext);
  const [Sort, setSort] = useState(sort || {});
  const [selected, setSelected] = useState<any[]>([]);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const handleCheckAll = (checked: any, contextValue: any) => {
    let select = selected;
    const textinputs =
      tbodyRef.current != null
        ? tbodyRef.current.querySelectorAll(
          ".grid-select input[type=checkbox]"
        )
        : null;
    let inputCanXL = [].filter.call(
      textinputs,
      function (el: HTMLInputElement) {
        return el.checked !== checked;
      }
    );
    inputCanXL.forEach((item: any) => {
      item.checked = checked;
      if (checked) {
        select[item.value] = checked;
      } else {
        delete select[item.value];
      }
    });
    setSelected(select);
    processHanleChange("changeSelected", { selected: selected }, contextValue);
  };

  const handleCheckItem = (key: any, checked: any, contextValue: any) => {
    let select = selected;
    if (checked) {
      select[key] = checked;
      setSelected(select);
      processHanleChange(
        "changeSelected",
        { selected: selected },
        contextValue
      );
    } else {
      delete select[key];
      setSelected(select);
      processHanleChange(
        "changeSelected",
        { selected: selected },
        contextValue
      );
    }
  };

  const handleSort = (sortKey: any, contextValue: any) => {
    const nsort: any[] = [];
    let typeSort = Sort[sortKey];
    if (typeSort) {
      typeSort = typeSort === "asc" ? "desc" : "asc";
    } else {
      typeSort = "asc";
    }
    nsort[sortKey] = typeSort;
    setSort(nsort);
    processHanleChange("changeSort", { sort: nsort }, contextValue);
  };

  const processHanleChange = (event: any, data: any, contextValue: any) => {
    // debugger;
    if (handleChange) {
      handleChange({ event: event, data: data });
    }
    if (contextValue && contextValue.gridViewHandleChange) {
      contextValue.gridViewHandleChange({ event: event, data: data });
    }
  };
  const onResetColum = (column: any) => {
    // alert(column);
    processHanleChange(
      "resetColumn",
      { filter: column },
      contextValue
    );
  }

  return (
    <>
      <table
        className={[
          "text-sm text-left text-black dark:text-gray-400 mx-2 table-striped table-hover w-[-webkit-fill-available]",
          className,
        ].join(" ")}
      >
        <thead className="text-xs text-white uppercase bg-header-grid">
          <tr>
            {!noSelected && (
              <th
                scope="col"
                className="p-4 border text-center border-slate-300"
              >
                <div className="flex items-center grid-select">
                  <input
                    id={`checkbox-all-search`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onChange={(ev) => {
                      handleCheckAll(ev.currentTarget.checked, contextValue);
                    }}
                  />
                  <label
                    htmlFor={`checkbox-all-search}`}
                    className="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </th>
            )}
            {Children.map(children, (child, key) => {
              // eslint-disable-next-line no-unused-vars
              if (child.type.name === Column.name) {
                const { title, className, sortKey, style, typeColumn, filterName } = child.props;

                return (
                  <th
                    key={key}
                    scope="col"
                    className={[
                      "px-3 py-1 border text-center border-slate-300",
                      className,
                    ].join(" ")}
                    style={style}
                  >
                    <div className={`flex items-center ${Sort[sortKey]} item-hover component-container`}>
                      {title}
                      {!!sortKey && (
                        <>
                          <span
                            onClick={() => {
                              handleSort(sortKey, contextValue);
                            }}
                          >
                            <AiOutlineCaretUp className="w-3 h-3 ml-1 desc-icon opacity-30" />
                            <AiOutlineCaretDown className="w-3 h-3 ml-1 asc-icon opacity-30" />
                          </span>
                          <span style={{marginLeft: "auto"}}>
                          <ToggleVisibility onReset={onResetColum} column={sortKey} title={title} typeColumn={typeColumn} filterName={filterName}>
                            </ToggleVisibility>
                          </span>
                        </>
                      )}
                    </div>
                  </th>
                );
              }
            })}
          </tr>
        </thead>
        <tbody ref={tbodyRef}>
          {Number(total) > 0 ? (
            <>
              {Array.isArray(data) &&
                data.map((item, index) => {
                  return (
                    <tr
                      id={`row-id-${keyExtractor({ item, index }) || index}`}
                      className={`${selected[keyExtractor({ item, index })]
                        ? "selected"
                        : ""
                        } ${item?.checkconent ? "activeitem" : ""
                        } bg-white border-b`}
                      key={keyExtractor({ item, index }) || index}
                    >
                      {!noSelected && (
                        <td className="w-4 p-3 border border-slate-300">
                          <div className="flex items-center">
                            <input
                              value={keyExtractor({ item, index })}
                              id={
                                keyExtractor({ item, index }) !== undefined
                                  ? keyExtractor({ item, index }).toString()
                                  : index.toString()
                              }
                              onChange={(ev) => {
                                handleCheckItem(
                                  ev.currentTarget.value,
                                  ev.currentTarget.checked,
                                  contextValue
                                );
                              }}
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="checkbox-table-search-1" className="sr-only"
                            >
                              checkbox
                            </label>
                          </div>
                        </td>
                      )}
                      {Children.map(children, (child, key) => {
                        // eslint-disable-next-line no-unused-vars
                        if (child.type.name === Column.name) {
                          const {
                            // eslint-disable-next-line no-unused-vars
                            title,
                            className,
                            body,
                            // eslint-disable-next-line no-unused-vars
                            sortKey,
                            typeColumn,
                            parents
                          } = child.props;
                          return (
                            <td
                              key={key}
                              className={[
                                "px-3 py-[7px] border border-slate-300",
                                className,
                              ].join(" ")}
                            >
                              {body({ item, index })}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
            </>
          ) : (
            <tr>
              {noSelected ? (
                <td
                  colSpan={
                    Array.isArray(children)
                      ? children.filter((x) => !Array.isArray(x)).length +
                      children
                        .filter((x) => Array.isArray(x))
                        .reduce((total, arg) => total + arg.length, 0)
                      : null
                  }
                  className="items-center h-10 border border-slate-300"
                  style={{ textAlign: "center" }}
                >
                  Không có dữ liệu
                </td>
              ) : (
                <td
                  colSpan={
                    Array.isArray(children)
                      ? children.filter((x) => !Array.isArray(x)).length +
                      children
                        .filter((x) => Array.isArray(x))
                        .reduce((total, arg) => total + arg.length, 0) +
                      1
                      : null
                  }
                  className="items-center h-10 border border-slate-300"
                  style={{ textAlign: "center" }}
                >
                  Không có dữ liệu
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        page={page}
        page_size={page_size}
        total={total}
        pageSizeOptions={pageSizeOptions}
        handleChange={(res) => {
          processHanleChange(res.event, res.data, contextValue);
        }}
      ></Pagination>
    </>
  );
};

Table.displayName = "Table";
Table.Column = Column;

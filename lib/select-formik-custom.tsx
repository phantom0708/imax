import React from "react";
import  Select from "react-select";
import {useFormikContext,useField} from "formik";
type MyOption = {
    label: string;
    value: any;
  };
  //define the group option type
  type GroupedOption = {
    label: string; // group label
    options: MyOption[];
  };
  
export const TanetSelect = (props: Props) => {
    const { name,label,view,required, ...restProps } = props;
    const [field,meta] = useField(name);
    const { setFieldValue } = useFormikContext();
    //flatten the options so that it will be easier to find the value
    const flattenedOptions = props.options?.flatMap((o) => {
      const isNotGrouped = "value" in o;
      if (isNotGrouped) {
        return o;
      } else {
        return o.options;
      }
    });
  
    //get the value using flattenedOptions and field.value
    const value = flattenedOptions?.filter((o) => {
      const isArrayValue = Array.isArray(field.value);
      if (isArrayValue) {
        const values = field.value as Array<any>;
        return values.includes(o.value);
      } else {
        return field.value === o.value;
      }
    });
  
    return (
        <div>
        <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {required ? <span className="text-red-500"> (*)</span> : ""}
        </label>
      <Select
        {...restProps}
        isDisabled={view}
        className="block mt-2 w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={value}
        // onChange implementation
        onChange={(val) => {
          //here I used explicit typing but there maybe a better way to type the value.
          if(val){
            const _val = val as MyOption[] | MyOption;
            const isArray = Array.isArray(_val);
            if (isArray) {
              const values = _val.map((o) => o.value);
              setFieldValue(name, values);
              if (props.onChange) {
                props.onChange({
                  persist: () => { },
                  target: {
                    type: 'change',
                    id: props.id || null,
                    name: props.name,
                    value: values
                  }
                });
              }
            } else {
              setFieldValue(name, _val.value);
              if (props.onChange) {
                props.onChange({
                  persist: () => { },
                  target: {
                    type: 'change',
                    id: props.id || null,
                    name: props.name,
                    value: _val.value
                  }
                });
              }
            }
          }
          else{
            setFieldValue(name, null);
            if (props.onChange) {
              props.onChange({
                persist: () => { },
                target: {
                  type: 'change',
                  id: props.id || null,
                  name: props.name,
                  value: null
                }
              });
            }
          }
          
        }}
      />
      {meta.touched && meta.error ? (
            <div className="text-red-500 text-sm">{meta.error}</div>
          ) : null}
      </div>
    );
  };
"use client"
import React from "react";
import { useField, useFormikContext } from "formik";
export const TanetInput = ({
  label = "",
  view = false,
  required = false,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {required ? <span className="text-red-500"> (*)</span> : ""}
      </label>
      {view ? (
        <input className="text-input block w-full mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus-visible:outline-none" readOnly {...field} {...props} />
      ) : (
        <input className="text-input block w-full mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus-visible:outline-none" {...field} {...props} />
      )}
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </>
  );
};


export const TanetCheckbox = ({ children, view = false, ...props }) => {
  // React treats radios and checkbox inputs differently from other input types: select and textarea.
  // Formik does this too! When you specify `type` to useField(), it will
  // return the correct bag of props for you -- a `checked` prop will be included
  // in `field` alongside `name`, `value`, `onChange`, and `onBlur`
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div>
      <label className="checkbox-input">
        {view ? (
          <input type="checkbox" className="w-5 h-5 mr-2 rounded-md border-0 py-1.5 px-1.5 text-blue-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus-visible:outline-none" disabled {...field} {...props} />
        ) : (<input type="checkbox" className="w-5 h-5 mr-2 rounded-md border-0 py-1.5 px-1.5 text-blue-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus-visible:outline-none" {...field} {...props} />)}
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const TanetTextArea = ({
  label = "",
  view = false,
  required = false,
  ...props
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {required ? <span className="text-red-500"> (*)</span> : ""}
      </label>
      {view ? (
        <textarea className='text-input block w-full mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' readOnly {...field} {...props} ></textarea>
      ) : (
        <textarea className='text-input block w-full mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' {...field} {...props} ></textarea>
      )}
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </>
  );
};

export const TanetRadioCheck = ({
  label = "",
  view = false,
  required = false,
  data = [],
  ...props
}) => {
  const { name } = props;
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {required ? <span className="text-red-500"> (*)</span> : ""}
      </label>
      <div className="p-3">
        {data.map(option => (
          <label key={option.value} className="mr-5">
            <input
              type="radio"
              className="mr-1"
              name="radioOption"
              value={option.value}
              disabled={view}
              checked={field.value === option.value}
              onChange={() => setFieldValue(name, option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>

      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">{meta.error}</div>
      ) : null}
    </>
  );
};

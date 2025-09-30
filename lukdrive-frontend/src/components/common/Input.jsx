import React from 'react';

const Input = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  ...props
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          {...(register ? register(name) : {})}
          className={`appearance-none block w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default Input;
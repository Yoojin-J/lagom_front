import React from 'react'

const Devider = ({ width = 100 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="1"
      viewBox="0 0 100 1"
      fill="none"
    >
      <g clip-path="url(#clip0_913_4356)">
        <rect width="100" height="1" fill="#F4F5F6" />
      </g>
      <defs>
        <clipPath id="clip0_913_4356">
          <rect width="100" height="1" rx="0.5" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Devider
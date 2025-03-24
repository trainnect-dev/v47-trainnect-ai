export const ArrowUpIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width={size}
    style={{ color: "currentcolor" }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.70711 1.39644C8.31659 1.00592 7.68342 1.00592 7.2929 1.39644L2.21968 6.46966L1.68935 6.99999L2.75001 8.06065L3.28034 7.53032L7.25001 3.56065V14.25V15H8.75001V14.25V3.56065L12.7197 7.53032L13.25 8.06065L14.3107 6.99999L13.7803 6.46966L8.70711 1.39644Z"
      fill="currentColor"
    ></path>
  </svg>
);

export const ChevronDownIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width={size}
    style={{ color: "currentcolor" }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z"
      fill="currentColor"
    />
  </svg>
);

export const ChevronUpIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width={size}
    style={{ color: "currentcolor" }}
    className="rotate-0"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.74999 3.93933L7.28032 4.46966L10.1035 7.29288C10.4941 7.68341 10.4941 8.31657 10.1035 8.7071L7.28032 11.5303L6.74999 12.0607L5.68933 11L6.21966 10.4697L8.68933 7.99999L6.21966 5.53032L5.68933 4.99999L6.74999 3.93933Z"
      fill="currentColor"
    ></path>
  </svg>
);

export const SpinnerIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    height={size}
    strokeLinejoin="round"
    viewBox="0 0 16 16"
    width={size}
    style={{ color: "currentcolor" }}
  >
    <g clipPath="url(#clip0_2393_1490)">
      <path d="M8 0V4" stroke="currentColor" strokeWidth="1.5" />
      <path
        opacity="0.5"
        d="M8 16V12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        opacity="0.9"
        d="M3.29773 1.52783L5.64887 4.7639"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        opacity="0.1"
        d="M12.7023 1.52783L10.3511 4.7639"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        opacity="0.4"
        d="M12.7023 14.472L10.3511 11.236"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        opacity="0.6"
        d="M3.29773 14.472L5.64887 11.236"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        opacity="0.2"
        d="M15.6085 5.52783L11.8043 6.7639"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        opacity="0.7"
        d="M0.391602 10.472L4.19583 9.23598"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        opacity="0.3"
        d="M15.6085 10.4722L11.8043 9.2361"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        opacity="0.8"
        d="M0.391602 5.52783L4.19583 6.7639"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </g>
    <defs>
      <clipPath id="clip0_2393_1490">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const VercelIcon = ({ size = 17 }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1L16 15H0L8 1Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const StopIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      viewBox="0 0 16 16"
      width={size}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3H13V13H3V3Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const CheckedSquare = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 16H1C0.447715 16 0 15.5523 0 15V1C0 0.447715 0.447716 0 1 0L15 8.17435e-06C15.5523 8.47532e-06 16 0.447724 16 1.00001V15C16 15.5523 15.5523 16 15 16ZM11.7803 6.28033L12.3107 5.75L11.25 4.68934L10.7197 5.21967L6.5 9.43935L5.28033 8.21967L4.75001 7.68934L3.68934 8.74999L4.21967 9.28033L5.96967 11.0303C6.11032 11.171 6.30109 11.25 6.5 11.25C6.69891 11.25 6.88968 11.171 7.03033 11.0303L11.7803 6.28033Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

export const UncheckedSquare = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={size}
      style={{ color: "currentcolor" }}
    >
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
};

export const PaperClipIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2C4 1.44772 4.44772 1 5 1H13C13.5523 1 14 1.44772 14 2V10C14 10.5523 13.5523 11 13 11H11V13C11 13.5523 10.5523 14 10 14H2C1.44772 14 1 13.5523 1 13V5C1 4.44772 1.44772 4 2 4H4V2ZM4 5.5V10C4 10.5523 4.44772 11 5 11H9.5V12.5H2.5V5.5H4ZM5.5 2.5V9.5H12.5V2.5H5.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const XIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0607 3.93934L8 8.00001L3.93934 3.93934L2.87868 5.00001L6.93934 9.06067L2.87868 13.1213L3.93934 14.182L8 10.1213L12.0607 14.182L13.1213 13.1213L9.06066 9.06067L13.1213 5.00001L12.0607 3.93934Z"
        fill="currentColor"
      />
    </svg>
  );
};

export function SearchIcon({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export const CopyIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2C4 1.44772 4.44772 1 5 1H13C13.5523 1 14 1.44772 14 2V10C14 10.5523 13.5523 11 13 11H11V13C11 13.5523 10.5523 14 10 14H2C1.44772 14 1 13.5523 1 13V5C1 4.44772 1.44772 4 2 4H4V2ZM4 5.5V10C4 10.5523 4.44772 11 5 11H9.5V12.5H2.5V5.5H4ZM5.5 2.5V9.5H12.5V2.5H5.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const CheckIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"
        fill="currentColor"
      />
    </svg>
  );
};

export const PlusIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => {
  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 16 16"
      className={className}
      style={{ color: "currentcolor" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2.5C8.41421 2.5 8.75 2.83579 8.75 3.25V7.25H12.75C13.1642 7.25 13.5 7.58579 13.5 8C13.5 8.41421 13.1642 8.75 12.75 8.75H8.75V12.75C8.75 13.1642 8.41421 13.5 8 13.5C7.58579 13.5 7.25 13.1642 7.25 12.75V8.75H3.25C2.83579 8.75 2.5 8.41421 2.5 8C2.5 7.58579 2.83579 7.25 3.25 7.25H7.25V3.25C7.25 2.83579 7.58579 2.5 8 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

const SimpleLogo = () => (
  <svg
    className="w-10 h-10"
    viewBox="16 18 36 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* <!-- 막대 그래프 (수입/지출 표시) --> */}
    <rect x="30" y="20" width="6" height="26" fill="#34D399" rx="2" />
    <rect x="18" y="30" width="6" height="16" fill="#60A5FA" rx="2" />
    <rect x="42" y="36" width="6" height="10" fill="#F87171" rx="2" />

    {/* <!-- 아래쪽 선 -->
  <!-- <line x1="14" y1="46" x2="50" y2="46" stroke="#94A3B8" stroke-width="2"/> --> */}
  </svg>
);

export default SimpleLogo;

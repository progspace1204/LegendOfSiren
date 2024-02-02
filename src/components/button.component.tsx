export const ButtonComponent: React.FC<{
  children: React.ReactNode
  className?: string
  onClick?: Function
}> = (props) => {
  return (
    <button
      className={`btn-pink rounded-full border bg-pink-500 px-8 py-2 text-lg text-white ${props.className}`}
      onClick={() => (props.onClick ? props.onClick() : {})}
    >
      {props.children}
    </button>
  )
}

interface ParentLayoutWrapper {
    children: React.ReactNode
}

const ParentLayout = ({children}: ParentLayoutWrapper) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-col-4 xl:grid-cols-5 gap-2 p-10">
            {children}
        </div>
    )
}
export default ParentLayout
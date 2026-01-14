import { useDispatch } from "react-redux"
import { decrementByNumber , incrementByNumber } from "../../store/pageSlice"
import { useAppSelector } from "../../hooks"
interface ParentLayoutWrapper {
    children: React.ReactNode
}

const ParentLayout = ({children}: ParentLayoutWrapper) => {
    const dispatch = useDispatch()
    const currentVal = useAppSelector(state => state.page.pageCount)


    return (
        <>
        <div  className="sm:px-20 sm:py-10">
        <div className='flex gap-4'>
        
            <div onClick={() => dispatch(decrementByNumber(1))} className="w-[30px] cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g data-name="20-Arrow Left"><path d="M16 0a16 16 0 1 0 16 16A16 16 0 0 0 16 0zm0 30a14 14 0 1 1 14-14 14 14 0 0 1-14 14z"/><path d="m8.41 15 5.29-5.29-1.41-1.42-7 7a1 1 0 0 0 0 1.41l7 7 1.41-1.41L8.41 17H27v-2z"/></g></svg>
            </div>
            <h1>Page {currentVal >= 1 ? currentVal : "Nothing more" }</h1>
            <div onClick={() => dispatch(incrementByNumber(1))} className="w-[30px] cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g data-name="19-Arrow Right"><path d="M16 0a16 16 0 1 0 16 16A16 16 0 0 0 16 0zm0 30a14 14 0 1 1 14-14 14 14 0 0 1-14 14z"/><path d="m26.71 15.29-7-7-1.42 1.42 5.3 5.29H5v2h18.59l-5.29 5.29 1.41 1.41 7-7a1 1 0 0 0 0-1.41z"/></g></svg>
            </div>

          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-col-4 xl:grid-cols-5 gap-2 ">
                {children}
            </div>
        </div>
        </>
    )
}
export default ParentLayout
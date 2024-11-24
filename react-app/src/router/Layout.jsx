// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { ModalProvider, Modal } from "../context/Modal";
// import { thunkAuthenticate } from "../redux/session";
// import Navigation from "../components/Navigation/Navigation";
// import StockSideBar from "../components/HomePage/StockSideBar";
// import { Outlet, useParams } from 'react-router-dom';
// import TradingSideBar from "../components/HomePage/TradingSideBar";

// export default function Layout() {
//   const dispatch = useDispatch();
//   const {stockId} = useParams()
//   const [isLoaded, setIsLoaded] = useState(false);
//   const user = useSelector((state) => state.session.user);
//   useEffect(() => {
//     dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
//   }, [dispatch]);

//   return (
//     <ModalProvider>
//       <div className="flex flex-col h-screen">
//         <Navigation />
//         <div className="flex">
//           <div className="w-1/4 border-2 border-gray-900">
//             <StockSideBar />
//           </div>
//           <div
//             className={`border-2 border-gray-900 ${
//               user && stockId ? "w-2/4" : "w-3/4"
//             }`}
//           >
//             {isLoaded && <Outlet />}
//           </div>
//         </div>
//       </div>
//       <Modal />
//     </ModalProvider>
//   );
// }
import { ModalProvider, Modal } from "../context/Modal";
import Navigation from "../components/Navigation/Navigation";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <ModalProvider>
        <Navigation />
        <Outlet />
      <Modal />
    </ModalProvider>
  );
}

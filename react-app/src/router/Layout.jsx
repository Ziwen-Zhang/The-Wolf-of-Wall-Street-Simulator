import { ModalProvider, Modal } from "../context/Modal";
import Navigation from "../components/Navigation/Navigation";
import { Outlet } from "react-router-dom";
import { useAutoTrading } from "../components/Hook/useAutoTrading";
import { useNotificationChecker } from "../components/Hook/useNotificationChecker";

import { useAutoUpdateUserAssets } from "../components/Hook/useAutoUpdateUserAssets";
import { useAutoStockUpdate } from "../components/Hook/useAutoUpdateStocks";

export default function Layout() {
  useAutoTrading()
  useNotificationChecker()
  useAutoStockUpdate
  useAutoUpdateUserAssets();
  return (
    <ModalProvider>
        <Navigation />
        <Outlet />
      <Modal />
    </ModalProvider>
  );
}

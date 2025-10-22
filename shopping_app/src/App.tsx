import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { ProductList } from "@/pages/ProductList";
import { ProductDetail } from "@/pages/ProductDetail";
import { Cart } from "@/pages/Cart";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { MyPage } from "@/pages/MyPage";
import { Support } from "@/pages/Support";
import { ComingSoon } from "@/components/common";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="support" element={<Support />} />
            <Route path="orders" element={<ComingSoon title="注文履歴" message="この機能は開発中です。" />} />
            <Route path="favorites" element={<ComingSoon title="お気に入り" message="この機能は開発中です。" />} />
            <Route path="addresses" element={<ComingSoon title="配送先住所" message="この機能は開発中です。" />} />
            <Route path="profile" element={<ComingSoon title="プロフィール編集" message="この機能は開発中です。" />} />
            <Route path="settings" element={<ComingSoon title="設定" message="この機能は開発中です。" />} />
            <Route path="contact" element={<ComingSoon title="お問い合わせ" message="この機能は開発中です。" />} />
            <Route path="chat" element={<ComingSoon title="チャットサポート" message="この機能は開発中です。" />} />
            <Route path="email-support" element={<ComingSoon title="メールサポート" message="この機能は開発中です。" />} />
            <Route path="terms" element={<ComingSoon title="利用規約" message="この機能は開発中です。" />} />
            <Route path="privacy" element={<ComingSoon title="プライバシーポリシー" message="この機能は開発中です。" />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

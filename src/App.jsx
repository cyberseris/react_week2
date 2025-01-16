import { useState } from 'react'
import axios from 'axios'

function App() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_PATH = import.meta.env.VITE_API_PATH;
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const [account, setAccount] = useState({
    username: "example@test.com",
    password: "example"
  });

  const handleInputChange = (e) => {
    const { value, name } = e.target
    setAccount({
      ...account,
      [name]: value
    })
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resLogin = await axios.post(`${BASE_URL}/v2/admin/signin`, account)
      const { token, expired } = resLogin.data

      setIsAuth(true)
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;

      /* const resProduct = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/admin/products`); */
      const resProduct = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products/all`);

      //console.log("resProduct", resProduct)
      setProducts(resProduct.data.products)

    } catch (error) {
      alert("登入失敗");
    }
  }

  const checkUserLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/v2/api/user/check`)
      alert("使用者已登入");
    } catch (error) {
      alert("使用者未登入");
    }
  }

  return (
    <>
      {isAuth ? (<div className="container">
        <div className="row mt-5" >
          <div className="col-md-6">
            <p className='d-flex'><button type="button" onClick={checkUserLogin} className="btn btn-success me-3">驗證使用者是否登入</button>
              <h3>產品列表</h3></p>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產聘名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.origin_price}</td>
                      <td>{product.price}</td>
                      <td>{product.is_enabled}</td>
                      <td><button type="button" onClick={() => setTempProduct(product)} className="btn btn-primary">查看細節</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="col-md-6">
            <h3>單一產品細節</h3>
            {tempProduct ? (<div className="card">
              <img src={tempProduct.imageUrl} className="card-img-top primary-image" alt={tempProduct.title} />
              <div className="card-body mt-3">
                <h5 className="card-title">{tempProduct.title}<span className="badge text-bg-primary ms-2">{tempProduct.category}</span></h5>
                <p className="card-text">商品描述：{tempProduct.description}</p>
                <p className="card-text">商品內容：{tempProduct.content}</p>
                <p className="card-text"><del>{tempProduct.origin_price}</del>/{tempProduct.price}元</p>
                <h5 className="mt-3">更多圖片：</h5>
                {
                  tempProduct?.imagesUrl?.map((imgUrl, index) => {
                    if (imgUrl) {
                      return (
                        <img src={imgUrl} key={index} className="images mb-2" alt={tempProduct.title} />
                      )
                    }
                  })
                }

              </div>
            </div>) : (<p className="text-secondary">請選擇一個商品查看</p>)
            }
          </div>
        </div>
      </div>
      ) : (<div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-5">請先登入</h1>
        <form className="d-flex flex-column gap-3">
          <div className="form-floating mb-3">
            <input type="email" onChange={handleInputChange} name="username" className="form-control" id="username" value={account.username} placeholder="name@example.com" />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input type="password" onChange={handleInputChange} value={account.password} name="password" className="form-control" id="password" placeholder="Password" />
            <label htmlFor="password">Password</label>
          </div>
          <button type="button" onClick={handleLogin} className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>)}
    </>
  )
}

export default App

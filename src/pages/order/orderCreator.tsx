import "./styles.css"
import {useEffect,useState,FormEvent } from "react"
import {Feedback} from "../../component/feedback/Feedback"
import {Link } from 'react-router-dom'
import api from "../../services/api"

export const OrderCreator: React.FC = () => {

    interface customerData{
        name:String
    }

    interface ProductsData{
        name:String,
        unitPrice:String,
        unitAllowBuy:Number
    }

    
    
    
    //Variaveis para armazenar os dados da chamada API
    const [customers, setCustomers] = useState([])
    const [products ,setProducts] = useState([])


    //Variaveis para armazenar as escolhas do usuario
    const [customersSelected, setCustomersSelected] = useState("")
    const [productSelected, setproductSelected ] =  useState("")
    const [amountSelected, setAmountSelected] = useState(0)
    const [unitPriceSelected, setUnitPriceSelected] = useState(0)
    
    //Variaveis para armazaenar o feedback relativo ao preço de venda

    const [color,setColor] = useState("")
    const [content,setContent] = useState("")
    const [hidden,setHidden] = useState(false)

   

    const [productToTest, setProductToTest] = useState({name:"",UnitPrice:0,unitAllowBuy:0})
    
    useEffect(()=>{
        async function SearchCustomers(){
            const responseCustomers  =  await api.get("/customer")
            const customerData = responseCustomers.data
            setCustomers(customerData)       
        }
        async function SearchProducts(){
            const responseProducts = await api.get("/product")
            const productsData = responseProducts.data
           
            setProducts(productsData)
        }
        SearchCustomers()
        SearchProducts()
    },[])


    useEffect(()=>{
         
        function SelectProductToTestAndResetState(){
            const data = products.filter((e:ProductsData)=>{
                // eslint-disable-next-line eqeqeq
                return e.name==productSelected
            } )
            
            setAmountSelected(0)
            setUnitPriceSelected(0)
            setProductToTest(data[0])
        }
        SelectProductToTestAndResetState()
        // eslint-disable-next-line 
    },[productSelected])
    
    useEffect(()=>{

        function CheckToNeedVerifyPrice(){
            if(productSelected===""){
                return 
            }
    
    
            let priceSelected = Number(unitPriceSelected)
            let PriceBase = Number(productToTest.UnitPrice)
            
            VerifyPrice(priceSelected,PriceBase)
            
        }

        CheckToNeedVerifyPrice()
        // eslint-disable-next-line 
    },[unitPriceSelected])


     //Verifica os multiplos possiveis para compra   


    function VerifyMultiples(numberToVerify:any,multipleNumber:any){
        
        if(numberToVerify<=0){
            alert(`Coloque um numero multiplo de ${multipleNumber}`)
        }
        if(multipleNumber===0){
            return true
        }
        if(numberToVerify%multipleNumber===0){
            return true
        }else{
            alert(`Sera aceito apenas numeros multiplos de ${multipleNumber}`)
        }
    }

    async function handleClick(e:FormEvent){
        e.preventDefault()
        if(amountSelected<=0){
            alert("O quantidade deve ser maior que zero")
            return  
        }
        const Validated = VerifyMultiples(amountSelected,productToTest.unitAllowBuy)

        if(!Validated){
            return
        }

        

        const data = {
            customer:customersSelected,
            item:{
                product:productSelected,
                amount:amountSelected,
                unitPrice:unitPriceSelected
            }
        }

        await api.post("/order",data)
        .then((response)=>{
           
            alert(`O pedido foi enviado com sucesso,o ID do pedido é: ${response.data}`)

        })
        .catch(()=>{
            alert("Erro ao enviar o seu pedido")
        })
        
       
    }

    function VerifyPrice(PriceSelected:number,PriceBase:number){
    
        if(PriceSelected>PriceBase){
            setContent("Rentabilidade Ótima")
            setColor("green")
            setHidden(true)
        }
        if(PriceSelected<=PriceBase && PriceSelected>PriceBase*0.9){
            setContent("Rentabilidade boa")
            setColor("orange")
            setHidden(true)
        }
        if(PriceSelected<PriceBase*0.9){
            console.log("aqui")
            setContent("Rentabilidade ruim")
            setColor("red")
            setHidden(true)
        }
    }

    


    return(
        <div className="order-container">
                    <header>
                        Criar pedido
                    </header>
            <form onSubmit={(e)=>{handleClick(e)}}>
                <div className="form-container">
                <label>Clientes:</label>
                <select required onChange={(e)=>setCustomersSelected(e.target.value)}>
                    <option selected disabled >Selecione um cliente</option>
                    {
                        customers.map((e:customerData)=>{
                           
                            return <option >{e.name}</option>
                        })
                    }
                </select>

               <h1 id="title-order">Pedido</h1>

               <label>Produto:</label>
               <select required onChange={(e)=>setproductSelected(e.target.value)}>
                  
                   <option selected disabled>Selecione um produto</option>
                    {products.map((e:ProductsData)=>{
                        return <option>{e.name}</option>
                    })}
                    
                </select>

                <label>Quantidade:</label>
                <input required value={amountSelected} onChange={(e)=>{
                    if(isNaN(Number(e.target.value))){
                        alert("O elemento digitado deve ser um numero")
                        return 
                    }
                    else{
                        setAmountSelected(Number((e.target.value)))
                    }
                }}></input>

               <div className="price-container">     
                <label>Preço unitario:</label>
                <Feedback color={color} content={content} hidden={hidden}/>
                </div>
                <input required  value={`R$${unitPriceSelected}`} onChange={(e)=>{
                    const value = e.target.value
                    const newValue  = value.substring(1).substring(1).replace(",","").replace(".","")
                    const numberValue = Number(newValue)
                
                    if(isNaN(numberValue)){
                        alert("O caracter digitado não é um numero")
                        return 
                    }

                    setUnitPriceSelected(numberValue)
                }}></input>

              
            <div id="buttons-container">
         
                <Link to="modifyOrder">
                <button>Alterar um pedido</button>
                </Link>
           
               
                
                <button type="submit">Enviar pedido</button>
                
                </div>
                </div>
            </form>
        </div>
            
    )
}


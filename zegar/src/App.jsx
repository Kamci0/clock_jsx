import React from "react";
import Zegar from "./Zegar";
import './style.css';

class App extends React.Component{
    constructor(){
        super();
        this.state={
            Czas:{
                godzina: -1,
                minuta: -1,
                sekunda: -1
            },
            // Czas_shift:{
            //     godzina: 0,
            //     minuta: 0,
            //     sekunda: 0
            // },
            zmiana: false
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.handle_click = this.handle_click.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.handle_reset = this.handle_reset.bind(this);
        this.odswiezanie = this.odswiezanie.bind(this);
    }


    handle_reset(){
        this.setState({zmiana: false})
        this.setState(()=>({
            // Czas_shift:{
            //     godzina: 0,
            //     minuta: 0,
            //     sekunda: 0
            // }
            Czas:{
                godzina: new Date().getHours(),
                minuta: new Date().getMinutes(),
                sekunda: new Date().getSeconds()
            }
        }),()=>((localStorage.setItem('Czas', JSON.stringify(this.state.Czas))), (localStorage.setItem('zmiana', JSON.stringify(this.state.zmiana)))));
    }

    handle_click(){
        let h = document.getElementById('hours').value;
        let m = document.getElementById('minutes').value;
        let s = document.getElementById('seconds').value;

        if(h>24){
            h=0;
        }

        if(m>60){
            m=0;
        }

        if(s>60){
            s=0;
        }


        this.setState(()=>({
            // Czas_shift:{
            //     godzina: Number(this.state.Czas_shift.godzina) + Number(h),
            //     minuta: Number(this.state.Czas_shift.minuta) + Number(m),
            //     sekunda: Number(this.state.Czas_shift.sekunda) + Number(s)
            // }
            Czas:{
                godzina: Number(h),
                minuta: Number(m),
                sekunda: Number(s)
            }
        }), ()=>((localStorage.setItem('Czas', JSON.stringify(this.state.Czas))), (localStorage.setItem('zmiana', JSON.stringify(this.state.zmiana)))));

        // this.setState({
        //     Czas: {
        //       godzina: this.state.Czas.godzina + Number(this.state.Czas_shift.godzina),
        //       minuta: this.state.Czas.minuta + Number(this.state.Czas_shift.minuta),
        //       sekunda: this.state.Czas.sekunda + Number(this.state.Czas_shift.sekunda),
        //     }
        // });

        this.setState({zmiana: true})

        document.querySelectorAll('input').forEach(element=>{
            element.value = ""
        })
    }

    //montowanie
    componentWillMount(){
        console.log("componentWillMount");
    }

    odswiezanie(){
        const shift = JSON.parse(localStorage.getItem("Czas")) || {godzina: 0, minuta: 0, sekunda: 0}; 
        const change = JSON.parse(localStorage.getItem("zmiana")) || false;
            
        this.setState({zmiana: change});

        if(!this.state.zmiana){
            this.setState({
                Czas:{
                    godzina: new Date().getHours(),
                    minuta: new Date().getMinutes(),
                    sekunda: new Date().getSeconds()
                }
            });
        }else{
            var zmiana_czasu = {
                godzina:  shift.godzina - new Date().getHours(),
                minuta: shift.minuta - new Date().getMinutes(),
                sekunda: shift.sekunda - new Date().getSeconds()
            }
            this.setState({
                // Czas:{
                //     godzina: new Date().getHours()+ Number(this.state.Czas_shift.godzina),
                //     minuta: new Date().getMinutes()+ Number(this.state.Czas_shift.minuta),
                //     sekunda: new Date().getSeconds()+ Number(this.state.Czas_shift.sekunda)
                // }
                // Czas:{
                //     godzina: new Date().getHours() + zmiana_czasu.godzina,
                //     minuta: new Date().getMinutes() + zmiana_czasu.minuta,
                //     sekunda: new Date().getSeconds() + zmiana_czasu.sekunda
                // }
                Czas:{
                    godzina: new Date().getHours() - zmiana_czasu['godzina'],
                    minuta: new Date().getMinutes() - zmiana_czasu['minuta'],
                    sekunda: new Date().getSeconds() - zmiana_czasu['sekunda']
                }
            }); 
        }    
    }

    componentDidMount(){
        console.log("componentDidMount");
        const change = JSON.parse(localStorage.getItem("zmiana")) || false;
            

        this.setState({zmiana: change})

        // if(change){
        //     this.setState({
        //         Czas:{
        //             godzina: shift.godzina,
        //             minuta: shift.minuta,
        //             sekunda: shift.sekunda
        //         }
        //     })
        // }
        // if(shift.minuta >= 60 ){
        //     shift.godzina+=1;
        //     shift.minuta-=60;
        // }

        // if(shift.sekunda >= 60){
        //     shift.minuta+=1;
        //     shift.sekunda-=60;
        // }

        // this.setState(()=>({
        //     Czas_shift:{
        //         godzina: shift.godzina,
        //         minuta: shift.minuta,
        //         sekunda: shift.sekunda
        //     }
        // }))

        

        // if(shift.godzina != 0 || shift.minuta != 0 || shift.sekunda != 0){
        //     this.setState({zmiana: true})
        //     this.setState({
        //         Czas: {
        //           godzina: new Date().getHours() + Number(this.state.Czas_shift.godzina),
        //           minuta: new Date().getMinutes() + Number(this.state.Czas_shift.minuta),
        //           sekunda: new Date().getSeconds() + Number(this.state.Czas_shift.sekunda),
        //         }
        //     });
        //     console.log("zmiana")
        // }else{
        //     this.setState({
        //         Czas:{
        //             godzina: new Date().getHours(),
        //             minuta: new Date().getMinutes(),
        //             sekunda: new Date().getSeconds()
        //     }})
        // }

        setInterval(this.odswiezanie, 1000);
    }

    //aktualizacja

    shouldComponentUpdate(){
        console.log("shouldComponentUpdate");
        return true;
    }

    componentDidUpdate(){
        console.log("ComponentDidUpdate");
    }

    //odmontowywanie

    componentWillUnmount(){
        console.log("componentWillUnmount")
        clearInterval(this.odswiezanie);
    }

    render(){
        return(
            <div className="wrapper">
                <h1>Zegar analogowy</h1>

                <div className="content">
                <Zegar godziny_r={this.state.Czas.godzina} minuty_r={this.state.Czas.minuta} sekundy_r={this.state.Czas.sekunda}/>
                <div className="inputs">
                    <div>
                        <label htmlFor="hours">Przesunięcie godzinowe: </label>
                        <input type="number" name="hours" id="hours" />
                    </div>
                    <div>
                        <label htmlFor="minutes">Przesunięcie minutowe: </label>
                        <input type="number" name="minutes" id="minutes" />
                    </div>
                    <div>
                        <label htmlFor="seconds">Przesunięcie sekundowe: </label>
                        <input type="number" name="seconds" id="seconds" />
                    </div>
                    <div>
                        <button onClick={this.handle_click}>Dodaj czas</button>
                        <button onClick={this.handle_reset}>Resetuj czas</button>
                    </div>
                    {/* <div>
                        Przesunięcie -  
                        {this.state.Czas_shift.godzina}:
                        {this.state.Czas_shift.minuta}:
                        {this.state.Czas_shift.sekunda}
                    </div> */}
                </div>
                </div>
                
                
            </div>
        )
    }
}

export default App;
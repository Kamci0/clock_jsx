import React from "react";
import Zegar from "./Zegar";

class App extends React.Component{
    constructor(){
        super();
        this.state={
            Czas:{
                godzina: -1,
                minuta: -1,
                sekunda: -1
            }
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.odswierzanie = this.odswierzanie.bind(this);
    }


    componentWillMount(){
        console.log("componentWillMount");
    }

    odswierzanie(){
        this.setState({
            Czas:{
                godzina: new Date().getHours(),
                minuta: new Date().getMinutes(),
                sekunda: new Date().getSeconds()
            }
        });
    }

    componentDidMount(){
        console.log("componentDidMount");
        this.setState({
            Czas:{
                godzina: new Date().getHours(),
                minuta: new Date().getMinutes(),
                sekunda: new Date().getSeconds()
        }})

        setInterval(this.odswierzanie, 1000)
    }


//16g= 120deg
//15g = 90deg
//30m = 180deg
//30m30s = 183deg
//31m = 186deg

    render(){
        return(
            <div>
                <Zegar godziny_r={this.state.Czas.godzina} minuty_r={this.state.Czas.minuta} sekundy_r={this.state.Czas.sekunda}/>
                <div className="inputs">

                </div>
            </div>
        )
    }
}

export default App;
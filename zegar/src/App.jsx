import React from "react";
import Zegar from "./Zegar";
import "./style.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      Czas: {
        godzina: -1,
        minuta: -1,
        sekunda: -1
      },
      Czas_shift: {
        godzina: 0,
        minuta: 0,
        sekunda: 0
      },
      zmiana: false
    };

    this.handle_click = this.handle_click.bind(this);
    this.handle_reset = this.handle_reset.bind(this);
    this.odswierzanie = this.odswierzanie.bind(this);
  }

  handle_reset() {
    this.setState({ zmiana: false });
    this.setState(
      {
        Czas_shift: {
          godzina: 0,
          minuta: 0,
          sekunda: 0
        }
      },
      () => localStorage.setItem("czas_shift", JSON.stringify(this.state.Czas_shift))
    );
  }

  handle_click() {
    let h = document.getElementById("hours").value;
    let m = document.getElementById("minutes").value;
    let s = document.getElementById("seconds").value;

    if (h > 24) {
      h = 0;
    }

    if (m > 60) {
      m = 0;
    }

    if (s > 60) {
      s = 0;
    }

    var temp_time = {
      godzina: Number(h),
      minuta: Number(m),
      sekunda: Number(s)
    };

    // Obecny czas
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    var currentSeconds = currentTime.getSeconds();

    // Różnica czasu
    var diffHours = temp_time.godzina - currentHours;
    var diffMinutes = temp_time.minuta - currentMinutes;
    var diffSeconds = temp_time.sekunda - currentSeconds;

    if (diffMinutes < 0) {
      diffHours -= 1;
      diffMinutes += 60;
    }

    if (diffSeconds < 0) {
      diffMinutes -= 1;
      diffSeconds += 60;
    }

    // Ustawienie stanu Czas_shift na różnicę czasu
    this.setState(
      prevState => ({
        Czas_shift: {
          godzina: diffHours,
          minuta: diffMinutes,
          sekunda: diffSeconds
        }
      }),
      () => {
        localStorage.setItem("czas_shift", JSON.stringify(this.state.Czas_shift));
      }
    );

    this.setState(prevState => ({
      Czas: {
        godzina: prevState.Czas.godzina + diffHours,
        minuta: prevState.Czas.minuta + diffMinutes,
        sekunda: prevState.Czas.sekunda + diffSeconds
      }
    }));

    this.setState({ zmiana: true });

    document.querySelectorAll("input").forEach(element => {
      element.value = "";
    });
  }

  odswierzanie() {
    if (!this.state.zmiana) {
      this.setState({
        Czas: {
          godzina: new Date().getHours(),
          minuta: new Date().getMinutes(),
          sekunda: new Date().getSeconds()
        }
      });
    } else {
      var shiftedSeconds = new Date().getSeconds() + Number(this.state.Czas_shift.sekunda);
      var shiftedMinutes = new Date().getMinutes() + Number(this.state.Czas_shift.minuta);
      var shiftedHours = new Date().getHours() + Number(this.state.Czas_shift.godzina);

      if (shiftedSeconds >= 60) {
        shiftedMinutes += Math.floor(shiftedSeconds / 60);
        shiftedSeconds %= 60;
      }

      if (shiftedMinutes >= 60) {
        shiftedHours += Math.floor(shiftedMinutes / 60);
        shiftedMinutes %= 60;
      }

      if (shiftedHours >= 24) {
        shiftedHours %= 24;
      }

      this.setState({
        Czas: {
          godzina: shiftedHours,
          minuta: shiftedMinutes,
          sekunda: shiftedSeconds
        }
      });
    }
  }

  componentDidMount() {
    const shift = JSON.parse(localStorage.getItem("czas_shift")) || {
      godzina: 0,
      minuta: 0,
      sekunda: 0
    };

    if (shift.minuta >= 60) {
      shift.godzina += Math.floor(shift.minuta / 60);
      shift.minuta %= 60;
    }

    if (shift.sekunda >= 60) {
      shift.minuta += Math.floor(shift.sekunda / 60);
      shift.sekunda %= 60;
    }

    if (shift.godzina >= 24) {
      shift.godzina %= 24;
    }

    this.setState(
      {
        Czas_shift: {
          godzina: shift.godzina,
          minuta: shift.minuta,
          sekunda: shift.sekunda
        }
      },
      () => {
        if (shift.godzina !== 0 || shift.minuta !== 0 || shift.sekunda !== 0) {
          this.setState({ zmiana: true });
          this.setState({
            Czas: {
              godzina: new Date().getHours() + Number(this.state.Czas_shift.godzina),
              minuta: new Date().getMinutes() + Number(this.state.Czas_shift.minuta),
              sekunda: new Date().getSeconds() + Number(this.state.Czas_shift.sekunda)
            }
          });
        } else {
          this.setState({
            Czas: {
              godzina: new Date().getHours(),
              minuta: new Date().getMinutes(),
              sekunda: new Date().getSeconds()
            }
          });
        }

        setInterval(this.odswierzanie, 1000);
      }
    );
  }

  componentWillUnmount() {
    clearInterval(this.odswierzanie);
  }

  render() {
    return (
      <div className="wrapper">
        <h1>Zegar analogowy</h1>

        <div className="content">
          <Zegar godziny_r={this.state.Czas.godzina} minuty_r={this.state.Czas.minuta} sekundy_r={this.state.Czas.sekunda} />
          <div className="inputs">
            <div>
              <label htmlFor="hours">Godziny nowego czasu: </label>
              <input type="number" name="hours" id="hours" />
            </div>
            <div>
              <label htmlFor="minutes">Minuty nowego czasu: </label>
              <input type="number" name="minutes" id="minutes" />
            </div>
            <div>
              <label htmlFor="seconds">Sekundy nowego czasu: </label>
              <input type="number" name="seconds" id="seconds" />
            </div>
            <div>
              <button onClick={this.handle_click}>Dodaj czas</button>
              <button onClick={this.handle_reset}>Resetuj czas</button>
            </div>
            <div>
              Przesunięcie {this.state.Czas_shift.godzina}:{this.state.Czas_shift.minuta}:{this.state.Czas_shift.sekunda} czas {this.state.Czas.godzina}:{this.state.Czas.minuta}:{this.state.Czas.sekunda}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

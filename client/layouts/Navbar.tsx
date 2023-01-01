import { JSXElement } from "@babel/types"
import * as React from "react"
import { Nav } from "react-bootstrap"

interface NavBarProps {
  suggestionList: Array<JSXElement>,
  autocompleteFunc: (string: string, experiments: Array<string>) => void,
  experiments: Array<string>
}

export default function Navbar(props: NavBarProps) {
  return (
    <Nav className="navbar navbar-dark stick-top bg-dark flex-md-nowrap">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">Ekho</a>
        <div className="autocomplete w-100">
          <input className="form-control form-control-dark w-100 experiment-input" type="text" placeholder="Search Experiments" aria-label="Search Experiments" onChange={(e)=>props.autocompleteFunc((document.querySelector(".experiment-input") as HTMLInputElement).value, props.experiments)}/>
            {props.suggestionList}
        </div>
    </Nav>
  )
}

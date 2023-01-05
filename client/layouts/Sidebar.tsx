import * as React from "react"
import { JSXElement } from "@babel/types"
import { Dropdown, ToggleButton } from "react-bootstrap"
import DownloadCSV from "../components/downloadCSVbutton"
import { DBBody } from "../../server/utils/types"
interface SidebarProps {
  currExperiment: string
  experimentsDropdown: Array<JSXElement>
  mismatch: boolean
  setMismatch: (mismatch: boolean) => void
  rawMismatchData: Data
}

interface Data extends DBBody{
  forEach: (el: object, idx?: number) => void
}

const Sidebar = ({ currExperiment, experimentsDropdown, mismatch, setMismatch, rawMismatchData}: SidebarProps) => {
  const mismatchOutline = !mismatch ? "outline-primary" : "primary"
  return (
    <div id="dropdown-body">
      <h4 style ={{fontSize:'2.4vw' }}>Experiment</h4>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {currExperiment}
            </Dropdown.Toggle>

            <Dropdown.Menu>{experimentsDropdown}</Dropdown.Menu>
          </Dropdown>
          <ToggleButton
            style ={{width:'100%', fontSize:'1vw', backgroundColor:'rgba(45, 112, 70, 0.664)'}}
            className="mb-2"
            id="toggle-check"
            type="checkbox"
            variant={`${mismatchOutline}`}
            checked={mismatch}
            value="1"
            onClick={(e) => {setMismatch(!mismatch)}}
          >
            {`Only Display Mismatches`}
          </ToggleButton>
          <DownloadCSV data={rawMismatchData} onlyMismatch={mismatch}/>
    </div>
  )
}

export default Sidebar;
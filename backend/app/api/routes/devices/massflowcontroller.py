from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/massflowcontroller", tags=["massflowcontroller"])

# banco simulado
VALVE_DB = {
    "valve_001": "closed",
    "valve_002": "open"
}

class ValveCreate(BaseModel):
    valve_id: str
    state: str = "closed"

class ValveToggle(BaseModel):
    state: str


@router.get("/")
async def list_valves():
    return VALVE_DB


@router.post("/add")
async def add_valve(data: ValveCreate):
    if data.valve_id in VALVE_DB:
        raise HTTPException(status_code=400, detail="Valve ID already exists")

    if data.state not in ["open", "closed"]:
        raise HTTPException(status_code=400, detail="Invalid state")
    
    VALVE_DB[data.valve_id] = data.state
    return {"status": "created", "valve_id": data.valve_id, "state": data.state}


@router.post("/{valve_id}/toggle")
async def toggle_valve(valve_id: str, data: ValveToggle):
    if data.state not in ["open", "closed"]:
        raise HTTPException(status_code=400, detail="Invalid state")

    VALVE_DB[valve_id] = data.state

    return {
        "valve_id": valve_id,
        "new_state": data.state,
        "status": "success"
    }

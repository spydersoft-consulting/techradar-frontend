import React, { useState, useEffect, MouseEvent } from "react";
import * as api from "../../api/Data";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { callDataApi, handleApiError } from "../../utils/ApiFunctions";
import { AxiosPromise } from "axios";

export const ArcEditor: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const routeParams = useParams();

  const dispatch = useAppDispatch();

  const [radarId, setRadarId] = useState<number>(parseInt(routeParams.radarId ?? "0"));
  const routeArcId: number = parseInt(routeParams.id ?? "0");

  const { radars } = useSelector((state: RootState) => state.radarlist);

  const radar = radars.find((r: api.Radar) => r.id === radarId);

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [arc, setLocalArc] = useState<api.RadarArc>({
    id: 0,
    radarId: radarId,
    name: "",
    radius: 10,
    color: "#000000",
    position: 0,
  });

  useEffect(() => {
    if (routeArcId > 0) {
      callDataApi((baseUrl) =>
        // todo: implement paging here
        api.ArcApiFactory(undefined, baseUrl).arcIdGet(routeArcId),
      ).then((result) => {
        setLocalArc(result.data);
        setRadarId(result.data.radarId ?? 0);
      });
    }
  }, [dispatch, routeArcId]);

  const handleCancelButtonClick = (): void => {
    navigate(`/radar/${arc.radarId}/arcs/`);
  };

  const handleSubmitEditForm = (e: MouseEvent<HTMLButtonElement>) => {
    let promise: AxiosPromise<void>;
    if (!routeArcId) {
      promise = callDataApi<void>((baseUrl) => api.ArcApiFactory(undefined, baseUrl).arcPost(arc));
    } else {
      promise = callDataApi<void>((baseUrl) => api.ArcApiFactory(undefined, baseUrl).arcIdPut(routeArcId, arc));
    }
    promise.then(() => navigate(`/radar/${arc.radarId}/arcs/`)).catch((e) => handleApiError(e, setErrors));

    e.preventDefault();
  };

  return (
    <form className="needs-validation" noValidate>
      <h4>
        <small className="text-muted">{radar?.title ?? "unknown"}</small> - Radar Ring
      </h4>
      <div className="form-group">
        <label htmlFor="txtName">Name</label>
        <input
          type="text"
          className={`form-control ${errors["Name"] == null ? "" : "is-invalid"}`}
          id="txtName"
          value={arc.name}
          onChange={(e) => setLocalArc({ ...arc, name: e.target.value })}
        />
        <div className="invalid-feedback">{errors["Name"]}</div>
      </div>
      <div className="form-group">
        <label htmlFor="txtRadius">Radius</label>
        <input
          type="number"
          className={`form-control ${errors["Radius"] == null ? "" : "is-invalid"}`}
          id="txtRadius"
          value={arc.radius}
          onChange={(e) => setLocalArc({ ...arc, radius: parseInt(e.target.value) })}
        />
        <div className="invalid-feedback">{errors["Radius"]}</div>
      </div>
      <div className="form-group">
        <label htmlFor="txtPosition">Position</label>
        <input
          type="number"
          className={`form-control ${errors["Position"] == null ? "" : "is-invalid"}`}
          id="txtPosition"
          value={arc.position}
          onChange={(e) => setLocalArc({ ...arc, position: parseInt(e.target.value) })}
        />
        <div className="invalid-feedback">{errors["Position"]}</div>
      </div>
      <div className="form-group">
        <label htmlFor="pickerColor">Color</label>
        <ColorPicker
          id="pickerColor"
          className={`form-control ${errors["Color"] == null ? "" : "is-invalid"}`}
          color={arc.color}
          onColorChange={(e: string) => setLocalArc({ ...arc, color: e })}
        />
        <div className="invalid-feedback">{errors["Color"]}</div>
      </div>
      <div className="row justify-content-center">
        <button className="btn btn-primary m-1" onClick={handleSubmitEditForm}>
          Save
        </button>
        <button className="btn btn-secondary m-1" onClick={handleCancelButtonClick}>
          Cancel
        </button>
      </div>
    </form>
  );
};

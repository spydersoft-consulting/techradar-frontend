import React, { useState, useEffect, MouseEvent } from "react";
import * as api from "../../api/Data";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { callDataApi, handleApiError } from "../../utils/ApiFunctions";
import { AxiosPromise } from "axios";
import { RootState } from "../../store/store";

export const QuadrantEditor: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const routeParams = useParams();

  const dispatch = useDispatch();
  const [radarId, setRadarId] = useState<number>(parseInt(routeParams.radarId ?? "0"));
  const routeQuadId: number = parseInt(routeParams.id ?? "0");

  const { radars } = useSelector((state: RootState) => state.radarlist);

  const radar = radars.find((r: api.Radar) => r.id === radarId);

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [quadrant, setLocalQuadrant] = useState<api.Quadrant>({
    id: 0,
    name: "",
    position: 1,
    color: "#000000",
    radarId: radarId,
  });

  useEffect(() => {
    if (routeQuadId > 0) {
      callDataApi((baseUrl) => api.QuadrantApiFactory(undefined, baseUrl).quadrantIdGet(routeQuadId)).then((result) => {
        setLocalQuadrant(result.data);
        setRadarId(result.data.radarId ?? 0);
      });
    }
  }, [dispatch, routeQuadId]);

  const handleCancelButtonClick = (): void => {
    navigate(`/radar/${quadrant.radarId}/arcs/`);
  };

  const handleSubmitEditForm = (e: MouseEvent<HTMLButtonElement>): void => {
    let promise: AxiosPromise<void>;

    if (routeQuadId) {
      promise = callDataApi((baseUrl) =>
        api.QuadrantApiFactory(undefined, baseUrl).quadrantIdPut(routeQuadId, quadrant),
      );
    } else {
      promise = callDataApi((baseUrl) => api.QuadrantApiFactory(undefined, baseUrl).quadrantPost(quadrant));
    }
    promise
      .then(() => {
        navigate(`/radar/${quadrant.radarId}/quadrants/`);
      })
      .catch((e) => handleApiError(e, setErrors));
    e.preventDefault();
  };

  return (
    <form className="needs-validation" noValidate>
      <h4>
        <small className="text-muted">{radar?.title ?? "unknown"}</small> - Radar Quadrant
      </h4>
      <div className="form-group">
        <label htmlFor="txtName">Name</label>
        <input
          type="text"
          className={`form-control ${errors["Name"] == null ? "" : "is-invalid"}`}
          id="txtName"
          value={quadrant.name}
          onChange={(e) => setLocalQuadrant({ ...quadrant, name: e.target.value })}
        />
        <div className="invalid-feedback">{errors["Name"]}</div>
      </div>
      <div className="form-group">
        <label htmlFor="txtPosition">Position</label>
        <input
          type="number"
          className={`form-control ${errors["Position"] == null ? "" : "is-invalid"}`}
          id="txtPosition"
          value={quadrant.position}
          onChange={(e) =>
            setLocalQuadrant({
              ...quadrant,
              position: parseInt(e.target.value),
            })
          }
        />
        <div className="invalid-feedback">{errors["Position"]}</div>
      </div>
      <div className="form-group">
        <label htmlFor="pickerColor">Color</label>
        <ColorPicker
          id="pickerColor"
          className={`form-control ${errors["Color"] == null ? "" : "is-invalid"}`}
          color={quadrant.color}
          onColorChange={(e: string) => setLocalQuadrant({ ...quadrant, color: e })}
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

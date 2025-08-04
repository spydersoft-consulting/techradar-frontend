import React, { useState, useEffect, MouseEvent } from "react";
import * as api from "../../api/Data";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { callDataApi, handleApiError } from "../../utils/ApiFunctions";
import { AxiosPromise } from "axios";
import { RootState } from "../../store/store";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

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
    <div className="container mx-auto px-4">
      <Card>
        <h4 className="text-2xl font-bold mb-6">
          <small className="text-gray-500">{radar?.title ?? "unknown"}</small> - Radar Quadrant
        </h4>
        <form className="space-y-4" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label htmlFor="txtName" className="block text-sm font-medium mb-2">
                Name
              </label>
              <InputText
                id="txtName"
                value={quadrant.name}
                onChange={(e) => setLocalQuadrant({ ...quadrant, name: e.target.value })}
                className={`w-full ${errors["Name"] != null ? "p-invalid" : ""}`}
              />
              {errors["Name"] && <small className="p-error">{errors["Name"]}</small>}
            </div>
            <div className="field">
              <label htmlFor="txtPosition" className="block text-sm font-medium mb-2">
                Position
              </label>
              <InputNumber
                id="txtPosition"
                value={quadrant.position}
                onValueChange={(e) => setLocalQuadrant({ ...quadrant, position: e.value ?? 1 })}
                className={`w-full ${errors["Position"] != null ? "p-invalid" : ""}`}
                min={1}
                max={4}
              />
              {errors["Position"] && <small className="p-error">{errors["Position"]}</small>}
            </div>
            <div className="field md:col-span-2">
              <label htmlFor="pickerColor" className="block text-sm font-medium mb-2">
                Color
              </label>
              <ColorPicker
                id="pickerColor"
                className={`form-control ${errors["Color"] == null ? "" : "is-invalid"}`}
                color={quadrant.color}
                onColorChange={(e: string) => setLocalQuadrant({ ...quadrant, color: e })}
              />
              {errors["Color"] && <small className="p-error">{errors["Color"]}</small>}
            </div>
          </div>
          <div className="flex justify-center gap-2 pt-4">
            <Button label="Save" icon="pi pi-save" onClick={handleSubmitEditForm} />
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="secondary"
              onClick={handleCancelButtonClick}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

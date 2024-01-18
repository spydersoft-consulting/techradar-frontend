import React, {
  useEffect,
  useState,
  MouseEventHandler,
  MouseEvent,
} from "react";
import * as api from "../../api/Data";
import { ColorPicker } from "../ColorPicker/ColorPicker";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { callDataApi, handleApiError } from "../../utils/ApiFunctions";
import { AxiosPromise } from "axios";
import { Container } from "react-bootstrap";

export const RadarEditor: React.FunctionComponent = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();

  const itemId = parseInt(routeParams.id ?? "0");
  const [radar, setLocalRadar] = useState<api.Radar>({
    id: 0,
    title: "",
    description: "",
    backgroundColor: "#FFFFFF",
    inactiveColor: "#DDDDDD",
    gridlineColor: "#BBBBBB",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    callDataApi((baseUrl) =>
      // todo: implement paging here
      api.RadarApiFactory(undefined, baseUrl).radarIdGet(itemId),
    ).then((result) => setLocalRadar(result.data));
  }, [dispatch, itemId]);

  const handleCancelButtonClick = () => {
    navigate("/");
  };

  const handleSubmitEditForm: MouseEventHandler<HTMLButtonElement> = (
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    let promise: AxiosPromise<void>;
    if (itemId === 0) {
      promise = callDataApi<void>((baseUrl) =>
        api.RadarApiFactory(undefined, baseUrl).radarPost(radar),
      );
    } else {
      promise = callDataApi<void>((baseUrl) =>
        api.RadarApiFactory(undefined, baseUrl).radarIdPut(itemId, radar),
      );
    }
    promise
      .then(() => navigate("/"))
      .catch((e) => handleApiError(e, setErrors));
    e.preventDefault();
  };

  return (
    <Container>
      <form className="needs-validation" noValidate>
        <h4>{radar.id === 0 ? "New" : "Edit"} Radar</h4>
        <div className="form-group">
          <label htmlFor="txtTitle">Title</label>
          <input
            type="text"
            className={`form-control ${errors["Title"] == null ? "" : "is-invalid"}`}
            id="txtTitle"
            name="title"
            value={radar.title ?? undefined}
            onChange={(e) => setLocalRadar({ ...radar, title: e.target.value })}
          />
          <div className="invalid-feedback">{errors["Title"]}</div>
        </div>
        <div className="form-group">
          <label htmlFor="txtDescription">Description</label>
          <input
            type="text"
            className="form-control"
            id="txtDescription"
            value={radar.description ?? undefined}
            onChange={(e) =>
              setLocalRadar({ ...radar, description: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="pickerBackground">Background Color</label>
          <ColorPicker
            id="pickerBackground"
            color={radar.backgroundColor}
            onColorChange={(e: string) =>
              setLocalRadar({ ...radar, backgroundColor: e })
            }
          />
          <label htmlFor="pickerGrid">Grid Line Color</label>
          <ColorPicker
            id="pickerGrid"
            color={radar.gridlineColor}
            onColorChange={(e: string) =>
              setLocalRadar({ ...radar, gridlineColor: e })
            }
          />
          <label htmlFor="pickerGrid">Inactive Color</label>
          <ColorPicker
            id="pickerGrid"
            color={radar.inactiveColor}
            onColorChange={(e: string) =>
              setLocalRadar({ ...radar, inactiveColor: e })
            }
          />
        </div>
        <div className="row justify-content-center">
          <button
            className="btn btn-primary m-1"
            onClick={handleSubmitEditForm}
          >
            Save
          </button>
          <button
            className="btn btn-secondary m-1"
            onClick={handleCancelButtonClick}
          >
            Cancel
          </button>
        </div>
      </form>
    </Container>
  );
};

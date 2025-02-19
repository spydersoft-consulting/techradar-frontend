import React, { useState, useEffect, useCallback, MouseEvent } from "react";
import * as api from "../../api/Data";
import { ItemNotesList } from "../ItemNotesList/ItemNotesList";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import { useNavigate, useParams } from "react-router-dom";
import { callDataApi, handleApiError } from "../../utils/ApiFunctions";
import { AxiosError, AxiosPromise } from "axios";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store/store";
import { fetchRadarArcList } from "../../store/slices/RadarArcListSlice";
import { fetchRadarQuadrantList } from "../../store/slices/RadarQuadrantListSlice";
import { fetchRadarTags } from "../../store/slices/RadarTagSlice";
import { fetchRadarList } from "../../store/slices/RadarListSlice";
import { Form, Container } from "react-bootstrap";
import { UiTag } from "../../types/objects";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

// interface Tag {
//   id: string;
//   name: string;
//   text: string;
//   className: string;
//   [key: string]: string;
// }

export const ItemEditor: React.FunctionComponent = () => {
  // Constants
  const navigate = useNavigate();
  const routeParams = useParams();

  const dispatch = useAppDispatch();

  // Route extraction
  const routeItemId: number = parseInt(routeParams.id ?? "0");

  const [radarId, setRadarId] = useState<number>(parseInt(routeParams.radarId ?? "0"));

  // Local State
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [item, setLocalItem] = useState<api.RadarItem>({
    id: routeItemId,
    radarId: radarId,
  });
  const [itemTags, setItemTags] = useState<Tag[]>();

  // Redux State Retrieval
  const { radars } = useSelector((state: RootState) => state.radarlist);

  const { arcs } = useSelector((state: RootState) => state.arclist);

  const { quadrants } = useSelector((state: RootState) => state.quadlist);

  const { radarTags } = useSelector((state: RootState) => state.radartags);

  const LoadItemTags = useCallback(() => {
    callDataApi((baseUrl) => api.ItemApiFactory(undefined, baseUrl).itemIdTagGet(routeItemId)).then((result) => {
      const itemTags: Tag[] = [];

      result.data.forEach((itemTag: api.RadarItemTag) => {
        const tag = radarTags.find((suggestion: UiTag) => {
          return suggestion.tagId === itemTag.tagId;
        });

        if (tag != null) {
          itemTags.push({
            id: tag.id,
            text: tag.text,
            className: "",
          });
        }
      });
      setItemTags(itemTags);
    });
  }, [routeItemId, radarTags]);

  const radar = radars.find((r: api.Radar) => r.id === radarId);
  useEffect(() => {
    if (!radar && radarId > 0) {
      dispatch(fetchRadarList());
    }
  }, [dispatch, radar, radarId]);

  // UseEffect calls
  useEffect(() => {
    if (routeItemId > 0) {
      callDataApi((baseUrl) => api.ItemApiFactory(undefined, baseUrl).itemIdGet(routeItemId)).then((result) => {
        setLocalItem(result.data);
        setRadarId(result.data.radarId ?? 0);
      });

      LoadItemTags();
    }
  }, [dispatch, routeItemId, LoadItemTags]);

  useEffect(() => {
    if (!arcs || arcs.length === 0) {
      dispatch(fetchRadarArcList(radarId));
    }
    if (!quadrants || quadrants.length === 0) {
      dispatch(fetchRadarQuadrantList(radarId));
    }
  }, [dispatch, radarId, arcs, quadrants]);

  useEffect(() => {
    dispatch(fetchRadarTags(radarId));
  }, [dispatch, radarId]);

  // Action Handlers
  const handleCancelButtonClick = (): void => {
    navigate(`/radar/${item.radarId}/items/`);
  };

  const handleSubmitEditForm = (e: MouseEvent<HTMLButtonElement>): void => {
    let promise: AxiosPromise<void>;
    if (routeItemId === 0) {
      promise = callDataApi<void>((baseUrl) => api.ItemApiFactory(undefined, baseUrl).itemPost(item));
    } else {
      promise = callDataApi<void>((baseUrl) => api.ItemApiFactory(undefined, baseUrl).itemIdPut(routeItemId, item));
    }

    promise
      .then(() => {
        navigate(`/radar/${item.radarId}/items/`);
      })
      .catch((e: Error | AxiosError) => handleApiError(e, setErrors));

    e.preventDefault();
  };

  const handleDeleteItemTag = (i: number): void => {
    if (itemTags == null) {
      return;
    }
    const deletedItem = itemTags[i];
    const itemId = parseInt(deletedItem.id);
    if (itemId > 0) {
      callDataApi((baseUrl) => api.ItemApiFactory(undefined, baseUrl).itemIdTagTagIdDelete(item.id ?? 0, itemId)).then(
        () => LoadItemTags(),
      );
    }
  };

  const handleAddItemTag = (tag: Tag): void => {
    const suggestion = radarTags.find((sugg: UiTag) => {
      return sugg.text === tag.text;
    });

    if (suggestion != null) {
      const tagData: api.ItemTag = {
        tagId: suggestion.tagId,
      };

      callDataApi((baseUrl) => api.ItemApiFactory(undefined, baseUrl).itemIdTagPut(item.id ?? 0, tagData)).then(() =>
        LoadItemTags(),
      );
    } else {
      const tagData: api.ItemTag = {
        name: tag.text,
      };
      callDataApi((baseUrl) => api.ItemApiFactory(undefined, baseUrl).itemIdTagPost(item.id ?? 0, tagData)).then(() =>
        dispatch(fetchRadarTags(item.radarId ?? 0)),
      );
    }
  };

  return (
    <Container>
      <Form className="needs-validation" noValidate>
        <h4>
          Radar Item - <small className="text-muted">{radar?.title ?? "unknown"}</small>
        </h4>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <input
            type="text"
            className={`form-control ${errors["Name"] == null ? "" : "is-invalid"}`}
            id="txtName"
            value={item.name ?? undefined}
            onChange={(e) => setLocalItem({ ...item, name: e.target.value })}
          />
          <div className="invalid-feedback">{errors["Name"]}</div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Legend Key</Form.Label>
          <input
            type="text"
            className={`form-control ${errors["LegendKey"] == null ? "" : "is-invalid"}`}
            id="txtKey"
            value={item.legendKey ?? undefined}
            onChange={(e) => setLocalItem({ ...item, legendKey: e.target.value })}
          />
          <div className="invalid-feedback">{errors["LegendKey"]}</div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Url</Form.Label>
          <input
            type="text"
            className={`form-control ${errors["Url"] == null ? "" : "is-invalid"}`}
            id="txtUrl"
            value={item.url ?? undefined}
            onChange={(e) => setLocalItem({ ...item, url: e.target.value })}
          />
          <div className="invalid-feedback">{errors["Url"]}</div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Quadrant</Form.Label>
          <select
            className="form-control"
            id="cmbQuadrant"
            value={item.quadrantId}
            onChange={(e) => setLocalItem({ ...item, quadrantId: parseInt(e.target.value) })}
          >
            <option defaultValue="" key="quad_0" value="0"></option>
            {quadrants.map((x) => (
              <option key={`quad_${x.id}`} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Arc</Form.Label>
          <select
            className="form-control"
            id="cmbArc"
            value={item.arcId}
            onChange={(e) => setLocalItem({ ...item, arcId: parseInt(e.target.value) })}
          >
            <option defaultValue="" key="arc_0" value="0"></option>
            {arcs.map((x) => (
              <option key={`arc_${x.id}`} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Tags</Form.Label>

          <ReactTags
            id="tagControl"
            tags={itemTags?.map((tag) => {
              return { id: tag.id, text: tag.text, className: "" };
            })}
            suggestions={radarTags.map((tag) => {
              return { id: tag.id, text: tag.text, className: "" };
            })}
            handleDelete={handleDeleteItemTag}
            handleAddition={handleAddItemTag}
            delimiters={delimiters}
            allowDragDrop={false}
            inputFieldPosition="bottom"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Add Note</Form.Label>
          <textarea
            className={`form-control ${errors["Note"] == null ? "" : "is-invalid"}`}
            id="txtNote"
            value={item.note ?? undefined}
            onChange={(e) => setLocalItem({ ...item, note: e.target.value })}
          />
          <div className="invalid-feedback">{errors["Note"]}</div>
        </Form.Group>
        <div className="row justify-content-center">
          <button className="btn btn-primary m-1" onClick={handleSubmitEditForm}>
            Save
          </button>
          <button className="btn btn-secondary m-1" onClick={handleCancelButtonClick}>
            Cancel
          </button>
        </div>
        <ItemNotesList radarItemId={item.id ?? 0} />
      </Form>
    </Container>
  );
};

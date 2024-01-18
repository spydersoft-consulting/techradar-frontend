import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import * as api from "../../api/Data";
import { useParams } from "react-router-dom";
import { callDataApi, handleApiError } from "../../utils/ApiFunctions";
import { NavigationBar } from "../NavigationBar/NavigationBar";
import { InputGroup, Form, Container, Nav, Button } from "react-bootstrap";
import { Multiselect } from "multiselect-react-dropdown";
import RadarView from "../RadarView/RadarView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import useEvent from "../../utils";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store/store";
import { fetchRadarView } from "../../store/slices/RadarViewSlice";
import { fetchRadarList } from "../../store/slices/RadarListSlice";
import { logInfo } from "../../logging";

export const RadarViewer: React.FunctionComponent = (): JSX.Element => {
  const routeParams = useParams();

  const dispatch = useAppDispatch();

  const radarId = parseInt(routeParams.id ?? "0");

  const [tags, setTags] = useState<api.ItemTag[]>([]);
  const [zoomedQuadrant, setZoomedQuadrant] = useState<number>(-1);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight - 70);
  const [localDays, setLocalDays] = useState<number | undefined>();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const { radars } = useSelector((state: RootState) => state.radarlist);

  const updateDimensions = (): void => {
    setHeight(window.innerHeight - 70);
    setWidth(window.innerWidth);
  };

  const { radarData, daysOld, selectedTagIds } = useSelector(
    (state: RootState) => state.radarview,
  );

  const radar = radars.find((r: api.Radar) => r.id === radarId);

  useEffect(() => {
    if (!radar) {
      dispatch(fetchRadarList());
    }
  }, [dispatch, radar]);

  useEffect(() => {
    if (radarId > 0) {
      callDataApi((baseUrl) =>
        api.RadarDataApiFactory(undefined, baseUrl).radarDataIdTagsGet(radarId),
      )
        .then((result) => {
          setTags(result.data);
        })
        .catch((e) => handleApiError(e, setErrors));
    }

    dispatch(fetchRadarView(radarId, selectedTagIds, daysOld));
  }, [dispatch, selectedTagIds, daysOld, radarId]);

  useEvent("resize", updateDimensions);

  const _handleQuadrantChanged = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    console.log("Quadrant Zoom");
    console.log(e);
    setZoomedQuadrant(parseInt(e.target.value));
  };

  const _handleFilterClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    dispatch(fetchRadarView(radarId, selectedTagIds, localDays));
  };

  const _handleDaysChanged = (daysString: string): void => {
    let daysParse: number | undefined;
    if (daysString && daysString !== "") {
      daysParse = parseInt(daysString);
      if (!daysParse) {
        return;
      }
    }
    setLocalDays(daysParse);
  };

  const _handleTagFilterChanged = (selectedList: api.ItemTag[]): void => {
    const tagIds: number[] = [];
    selectedList.forEach((tag) => {
      if (tag.tagId) {
        tagIds.push(tag.tagId);
      }
    });
    dispatch(fetchRadarView(radarId, tagIds, localDays));
  };

  const zoomOptions = [];
  if (radarData.quadrants) {
    for (let i = 0; i < 4; ++i) {
      const quad = radarData.quadrants[i];
      zoomOptions.push(
        <option key={`zoom_${i}`} value={i}>
          {quad.name}
        </option>,
      );
    }
  }

  if (errors) {
    logInfo(JSON.stringify(errors));
  }

  return (
    <Container fluid as="main" className="px-0">
      <NavigationBar brand={radar?.title ?? "Radar"}>
        <Form className="d-flex">
          <InputGroup size="sm">
            <Form.Control as="select" onChange={_handleQuadrantChanged}>
              <option key="zoom_all" value="-1">
                All
              </option>
              {zoomOptions}
            </Form.Control>
          </InputGroup>
        </Form>
        <Form className="d-flex">
          <InputGroup size="sm">
            <InputGroup.Text>Last</InputGroup.Text>
            <Form.Control
              type="number"
              id="txtDays"
              value={localDays}
              onChange={(e) => _handleDaysChanged(e.target.value)}
            />
            <InputGroup.Text>days</InputGroup.Text>
            <Button onClick={_handleFilterClick}>
              <FontAwesomeIcon icon={faFilter} />
            </Button>
          </InputGroup>
        </Form>
        <Nav.Item className="mx-1">
          <Multiselect
            placeholder="Select Tags"
            onSelect={_handleTagFilterChanged}
            onRemove={_handleTagFilterChanged}
            options={tags}
            displayValue="name"
            closeOnSelect={false}
          />
        </Nav.Item>
      </NavigationBar>
      <Container fluid className="px-0">
        <RadarView
          data={radarData}
          zoomed_quadrant={zoomedQuadrant}
          height={height ?? 700}
          width={width ?? 700}
        />
      </Container>
    </Container>
  );
};

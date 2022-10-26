import { useState, createContext, useContext } from "react";
import { DataFrame, DataFrameRenderer } from "./Dataframe";
import { ProblemConfig } from "./types";
import { ProblemConfigComponent } from "./ProblemConfigComponent";
import { ProblemDataDisplay } from "./ProblemDataDisplay";
import { Data2 } from "./Data2";

function useDataFrameDimensions(df: DataFrame) {
  const theme = useContext(ThemeContext);

  const dataWidth = theme.cellSize * df.nCols + theme.cellGap * (df.nCols - 1);
  return {
    width:
      theme.cellSize + theme.gap1 + dataWidth + theme.gap2 + theme.cellSize,
    dataWidth,
  };
}

const theme = {
  cellGap: 0,
  cellSize: 30,
  gap1: 10,
  gap2: 10,
  marginTop: 80,
  marginLeft: 10,
  marginRight: 10,
  marginBottom: 10,
  targetBorder: "#94547F",
  feBorder: "#E09E96",
};

export const ThemeContext = createContext(theme);

function App() {
  const [problemConfig, setProblemConfig] = useState<ProblemConfig>({
    featureEngineeringStart: -4,
    featureEngineeringEnd: -3,
    forecastHorizon: 3,
  });

  let df1 = new DataFrame({ name: "User Uploaded Data" });

  let df2 = df1.copy({ name: "Transformed" }).transform({
    gap: -problemConfig.featureEngineeringEnd,
    feWindow:
      problemConfig.featureEngineeringEnd -
      problemConfig.featureEngineeringStart +
      1,
    forecastHorizon: problemConfig.forecastHorizon,
  });

  const handleProblemChange = (newProblemConfig: ProblemConfig) => {
    setProblemConfig(newProblemConfig);
  };

  const forecastPt = 10;

  const df1Dims = useDataFrameDimensions(df1);
  const df2Dims = useDataFrameDimensions(df2);
  return (
    <ThemeContext.Provider value={theme}>
      <div className="mx-auto w-1/2">
        <div className="sticky top-0 bg-white border-b py-2">
          <div className="mb-3">
            <ProblemDataDisplay problemConfig={problemConfig} />
          </div>
          <ProblemConfigComponent
            problemConfig={problemConfig}
            featureEngineeringMax={10}
            forecastHorizonMax={10}
            onChange={handleProblemChange}
          />
        </div>
        <div className="bg-white">
          <h2>Model Training</h2>
        </div>
        <div>
          <hr />
          <svg width={1000} height={1000}>
            <rect
              x={theme.marginLeft - 10}
              y={
                theme.marginTop +
                (theme.cellSize + theme.cellGap) * forecastPt +
                2
              }
              width={df1Dims.width + 50 + df2Dims.width + 30}
              height={theme.cellSize - 4}
              fill="orange"
              opacity={0.5}
            />

            <rect
              x={theme.marginLeft - 10}
              y={
                theme.marginTop +
                (theme.cellSize + theme.cellGap) *
                  (forecastPt + problemConfig.forecastHorizon) +
                2
              }
              width={df1Dims.width + 20}
              height={theme.cellSize - 4}
              fill="red"
              opacity={0.5}
            />

            <rect
              x={theme.marginLeft - 10}
              y={
                theme.marginTop +
                (theme.cellSize + theme.cellGap) *
                  (forecastPt + problemConfig.featureEngineeringStart) +
                2
              }
              width={df1Dims.width + 20}
              height={
                theme.cellSize *
                  (problemConfig.featureEngineeringEnd -
                    problemConfig.featureEngineeringStart +
                    1) -
                4
              }
              fill="green"
              opacity={0.5}
            />

            <DataFrameRenderer dataframe={df1} />

            <rect
              x={theme.marginLeft + theme.cellSize + theme.gap1}
              y={
                theme.marginTop +
                (theme.cellSize + theme.cellGap) *
                  (forecastPt + problemConfig.featureEngineeringStart)
              }
              width={df1Dims.dataWidth}
              height={
                (theme.cellSize + theme.cellGap) *
                (problemConfig.featureEngineeringEnd -
                  problemConfig.featureEngineeringStart +
                  1)
              }
              stroke={theme.feBorder}
              strokeWidth={2}
              fill="none"
            />
            <rect
              x={
                theme.marginLeft +
                theme.cellSize +
                theme.gap1 +
                df1Dims.dataWidth +
                theme.gap2
              }
              y={
                theme.marginTop +
                (theme.cellSize + theme.cellGap) *
                  (forecastPt + problemConfig.forecastHorizon)
              }
              width={theme.cellSize}
              height={theme.cellSize}
              stroke={theme.targetBorder}
              strokeWidth={2}
              fill="none"
            />

            <g transform={`translate(${df1Dims.width + 100}, 0)`}>
              <DataFrameRenderer dataframe={df2} />

              <rect
                x={theme.marginLeft + theme.cellSize + theme.gap1}
                y={
                  theme.marginTop +
                  (theme.cellSize + theme.cellGap) * forecastPt
                }
                width={df2Dims.dataWidth}
                height={theme.cellSize}
                stroke="#E09E96"
                strokeWidth={2}
                fill="none"
              />
              <rect
                x={
                  theme.marginLeft +
                  theme.cellSize +
                  theme.gap1 +
                  df2Dims.dataWidth +
                  theme.gap2
                }
                y={
                  theme.marginTop +
                  (theme.cellSize + theme.cellGap) * forecastPt
                }
                width={theme.cellSize}
                height={theme.cellSize}
                stroke="#94547F"
                strokeWidth={2}
                fill="none"
              />
            </g>
          </svg>
        </div>

        <h2 className="mt-5">Prediction</h2>
        <hr />
        {/* <Data2 problemConfig={problemConfig} /> */}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;

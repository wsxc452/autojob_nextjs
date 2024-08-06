import { useEffect, useState } from "react";

function Versions() {
  const [versions, setVersions] = useState({
    electron: "0.0.0",
    chrome: "0.0.0",
    node: "0.0.0",
  });
  // const [versions] = useState(window.electron?.process?.versions||{
  //   electron: '0.0.0',
  //   chrome: '0.0.0',
  //   node: '0.0.0',
  // });
  useEffect(() => {
    if (window.electron?.process?.versions) {
      setVersions({
        electron: window.electron.process.versions.electron || "0.0.0",
        chrome: window.electron.process.versions.chrome || "0.0.0",
        node: window.electron.process.versions.node || "0.0.0",
      });
    }
  }, []);
  // console.log('window.electron', window.electron.process);
  console.log("versions", versions);
  return (
    <ul className="versions h-[40px] w-full">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
    </ul>
  );
}

export default Versions;

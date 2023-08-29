import React, { Component, useState, useEffect } from "react";
import tasks from "../src/tasks.json";

export default function Kapitelauswahl() {

  return (
    <div>
          {tasks.map((task) => (
            <div>
              <h2>
                {task.name}
              </h2>
              <p></p>
            </div>
          ))}
    </div>
  );
}
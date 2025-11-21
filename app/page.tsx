"use client";

import { CloseIcon } from "@/components/CloseIcon";
import FlashCardContainer from "@/components/FlashCardContainer";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import QuizContainer from "@/components/QuizContainer";
import TranscriptionView from "@/components/TranscriptionView";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import type { ConnectionDetails } from "./api/connection-details/route";

export default function Page() {
  const [room] = useState(new Room());

  const onConnectButtonClicked = useCallback(async () => {
    // Generate room connection details, including:
    //   - A random Room name
    //   - A random Participant name
    //   - An Access Token to permit the participant to join the room
    //   - The URL of the LiveKit server to connect to
    //
    // In real-world application, you would likely allow the user to specify their
    // own participant name, and possibly to choose from existing rooms to join.

    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await room.localParticipant.setMicrophoneEnabled(true);
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  return (
    <main data-lk-theme="default" className="h-full grid  bg-[var(--lk-bg)]">
      <RoomContext.Provider value={room}>
        <div className="  w-full h-full ">
          <SimpleVoiceAssistant onConnectButtonClicked={onConnectButtonClicked} />
        </div>
      </RoomContext.Provider>
    </main>
  );
}

function SimpleVoiceAssistant(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <>
      <AnimatePresence mode="wait">
        {agentState === "disconnected" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full flex flex-col   "
          >
            {/* HERO */}
            <div className="relative text-center space-y-32 h-full w-full">
              {/* Soft background halo */}
              <div
                className="absolute inset-0 -z-10 -my-5"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, rgba(180,180,255,0.80), transparent 40%)",
                }}
              />

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-200 leading-tight">
                  Learn Design With Confidence
                </h1>

                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  A voice-guided tutor built for creators. Explore color theory, typography, layout,
                  branding, UI/UX, and more — explained in a way that feels intuitive, visual, and
                  genuinely helpful.
                </p>
              </motion.div>

              {/* FEATURE CARDS */}
              {/* <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mx-24"
              >
                {[
                  {
                    icon: "🎨",
                    title: "Learn Visually",
                    desc: "Clear talk-throughs of color, spacing, grids, shapes, and styles.",
                  },
                  {
                    icon: "🗂️",
                    title: "Moodboard Notes",
                    desc: "Clean visual summaries created as you learn.",
                  },
                  {
                    icon: "✏️",
                    title: "Creative Tasks",
                    desc: "Short guided prompts to practice hands-on thinking.",
                  },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-6 rounded-2xl w-[300px] bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(245,245,255,0.7))",
                    }}
                  >
                    <div className="text-4xl mb-3">{f.icon}</div>
                    <h3 className="font-semibold text-lg text-gray-900">{f.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                  </motion.div>
                ))}
              </motion.div> */}

              {/* CTA */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-10"
              >
                <button
                  onClick={props.onConnectButtonClicked}
                  className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-black text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:bg-gray-900"
                >
                  <span>Start Your Design Session</span>
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                  >
                    →
                  </motion.span>
                </button>
              </motion.div>

              {/* SUBJECT CHIPS */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap gap-3 justify-center mt-8"
              >
                {[
                  "Color Theory",
                  "Typography",
                  "Brand Identity",
                  "Layout & Grids",
                  "UI/UX Principles",
                  "Illustration Basics",
                ].map((subject) => (
                  <span
                    key={subject}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition cursor-pointer"
                  >
                    {subject}
                  </span>
                ))}
              </motion.div> */}
            </div>
          </motion.div>
        ) : (
          /* CONNECTED */
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex  items-center flex-col gap-4 h-full p-10"
          >
            <div className="flex flex-row space-x-10">
              <AgentVisualizer />
              <div className="flex-1 w-full border-[0.5px] border-gray-200/15 rounded-lg ">
                <TranscriptionView />
                <FlashCardContainer />
                <QuizContainer />
              </div>
            </div>

            <div className="w-full">
              <ControlBar onConnectButtonClicked={props.onConnectButtonClicked} />
            </div>
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AgentVisualizer() {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  if (videoTrack) {
    return (
      <div className="h-[512px] w-[512px] rounded-lg overflow-hidden">
        <VideoTrack trackRef={videoTrack} />
      </div>
    );
  }
  return (
    <div className="h-[300px] w-full">
      <BarVisualizer
        state={agentState}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

function ControlBar(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="relative h-[60px]">
      <AnimatePresence>
        {agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-8 absolute left-1/2 -translate-x-1/2  justify-center"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

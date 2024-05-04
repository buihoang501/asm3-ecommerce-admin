import React, { useEffect, useState, useRef } from "react";

//CSS module
import classes from "./LiveChat.module.css";

//Socket io
import socket from "../utils/socket-io";

//Admin icon
import AdminIcon from "../ui/AdminIcon";

//React router dom
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";

//Uuid
import { v4 as uuidv4 } from "uuid";

//Session services
import { axiosGetSessions } from "../services/sessionServices";

//React redux hooks
import { useSelector } from "react-redux";

const LiveChat = () => {
  const { token } = useSelector((state) => state.auth);

  //navigate
  const navigate = useNavigate();

  //locate
  const locate = useLocation();

  //location search params
  const [location, setLocation] = useSearchParams();

  //Current roomId
  let currentRoomId = locate.search.split("_")[1];

  //Current clickId
  let clickRoomId = useRef();

  //Message state
  const [message, setMessage] = useState("");

  //Admin messages state
  const [messages, setMessages] = useState([]);
  //Room Ids
  const [roomIds, setRoomIds] = useState([]);

  //divRef
  const divRef = useRef();

  //TimeoutId
  let timeOutId = useRef();

  //Handle message change
  const messageChangeHandler = (e) => {
    //Set message
    setMessage(e.target.value);
  };

  //Handle submit message
  const handleSubmitSendMessage = async (e) => {
    //Prevent default behavior
    e.preventDefault();

    //Check empty message
    if (message.trim() === "") {
      return;
    }

    //Handle socket io
    socket.emit("message", {
      action: "admin-send",
      message: message,
      _id: currentRoomId,
      client: false,
    });
    //Scroll to bottom chat
    divRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });

    //Reset input
    setMessage("");
  };

  //Handle scroll chat bottom
  useEffect(() => {
    //Scroll to bottom chat
    timeOutId.current = setTimeout(() => {
      divRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
    //Clean up
    return () => {
      //Clear timeout
      clearTimeout(timeOutId.current);
    };
  }, [currentRoomId, locate.pathname, locate.search]);

  //Handle messages
  useEffect(() => {
    if (token && token !== "TOKEN EXPIRED") {
      const getSessions = async (token) => {
        const data = await axiosGetSessions(token);

        const roomIds =
          data.sessions.length > 0 &&
          data.sessions.map((session) => session._id);

        setRoomIds(roomIds);
        setMessages(data.sessions);
      };

      getSessions(token);
    }
  }, [token, locate.pathname, locate.search]);

  //Handle roomId change
  useEffect(() => {
    if (!locate.search.split("_")[1]) {
      clickRoomId.current = "";
    } else {
      clickRoomId.current = locate.search.split("_")[1];
    }

    //Set localStorage data from server
  }, [locate.pathname, locate.search]);

  //Handle chat effect with event IO
  useEffect(() => {
    //Scroll to bottom chat
    timeOutId.current = setTimeout(() => {
      divRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    //Listen message event
    const handleListenEvent = (data) => {
      //End-chat
      if (data.action === "server-send-end") {
        if (messages.length > 0) {
          //Update messages
          setMessages((prevMessages) => {
            return prevMessages.filter(
              (message) => message._id.toString() !== data?._id.toString()
            );
          });

          //Set roomIds
          setRoomIds((prevRoomIds) => {
            return prevRoomIds.filter(
              (roomId) => roomId.toString() !== data?._id?.toString()
            );
          });

          if (clickRoomId?.current?.toString() === data?._id.toString()) {
            return navigate("/?location=live-chat");
          }
        }
      }

      if (data.action === "server-send") {
        if (data.client) {
          //When receive client msgs
          //Scroll to bottom chat
          setTimeout(() => {
            divRef?.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }, 100);
        }

        //Get existing room
        const existRoom = messages.find((item) => {
          return item._id?.toString() === data?._id?.toString();
        });

        //Existing chat
        if (existRoom) {
          //Data message
          const message = {
            message: data.message,
            client: data.client,
          };

          //Update messages when room exists
          setMessages((prevMessages) => {
            const updatedMessage = [...prevMessages];
            const existingIndex = updatedMessage.findIndex(
              (message) => message._id.toString() === data?._id.toString()
            );

            updatedMessage[existingIndex] = {
              ...existRoom,
              messages: [...existRoom.messages, message],
            };
            return updatedMessage;
          });
        } else {
          //Set room ids
          setRoomIds((prevIds) => {
            if (prevIds.length > 0 && !prevIds.includes(data._id)) {
              return [...prevIds, data._id];
            }
            return [data._id];
          });
          const messages = [
            {
              message: data.message,
              client: data.client,
            },
          ];
          if (messages.length > 0) {
            setMessages((prevMessage) => [
              ...prevMessage,
              {
                _id: data._id,
                messages: messages,
              },
            ]);
          } else {
            setMessages([
              {
                _id: data._id,
                messages: messages,
              },
            ]);
          }
        }
      }
    };
    socket.on("message", handleListenEvent);

    setLocation({ location: location.get("location") });
    //Clean up func
    return () => {
      //Clean up socket message event
      socket.off("message", handleListenEvent);
    };
  }, [messages, setLocation, navigate, location]);

  return (
    <div className={classes["live-chat"]}>
      <h4>Chat</h4>
      <p>Apps / Chat</p>
      <div className={classes.container}>
        <div className={classes.left}>
          <div>
            <input type="text" placeholder="Search Contact" />
          </div>
          <div className={classes["list-chat"]}>
            {roomIds.length > 0 &&
              roomIds.map((roomId) => (
                <div
                  key={uuidv4()}
                  onClick={() => {
                    clickRoomId.current = roomId;
                    const path = location.get("location").split("_")[0];
                    setLocation({
                      location: `${path}_${roomId}`,
                    });
                  }}
                  className={
                    currentRoomId?.toString() === roomId?.toString()
                      ? `${classes.active} ${classes.item}`
                      : classes.item
                  }
                >
                  <AdminIcon />
                  <p>{roomId}</p>
                </div>
              ))}
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes["chat-content"]}>
            {messages?.length > 0 &&
              currentRoomId &&
              messages
                .filter(
                  (message) =>
                    message?._id?.toString() === currentRoomId?.toString()
                )
                .map((el) => {
                  return (
                    <div key={el._id}>
                      <div ref={divRef} className={classes.bottom}>
                        {el.messages.map((messageItem) => (
                          <div key={uuidv4()}>
                            {messageItem.client ? (
                              <p className={classes.client}>
                                <i>
                                  <AdminIcon />
                                </i>
                                <span>Client: {messageItem.message}</span>
                              </p>
                            ) : (
                              <p className={classes.admin}>
                                <span>You: {messageItem.message}</span>
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
          </div>
          {currentRoomId && (
            <form onSubmit={handleSubmitSendMessage} className={classes.action}>
              <input
                type="text"
                placeholder="Type and enter"
                onChange={messageChangeHandler}
                value={message}
              />
              <button type="submit">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChat;

"use client";
import { roboto } from "@/app/fonts";
import Formdata_ from "@/components/IdeaCreationGrp/FormdataCompo";
import ProjectUpdates from "@/components/ProjectUpdates";
import MemberList from "@/components/room/MemberList";
import RequestList from "@/components/room/RequestList";
import TextInputWithCloudinary from "@/components/TextAreaStyle";
import GeminiStyleInput from "@/components/TextAreaStyle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { Ideas, update, Rooms } from "../../../../../lib/interface/INTERFACE";
import axios from "axios";
import { useAtom } from "jotai";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    LightbulbIcon,
    List,
    Loader2,
    Paperclip,
    Pin,
    Settings,
    Upload,
    Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import ProjectCreateComponent from "../../project/create/page";
import ChatBasedProjectSubmit from "@/components/room/ChatBasedProjectComponent";
import useFirebaseNotifications from "../../../../../lib/control/FirebaseNotification";
import userAtom from "../../../../../lib/atoms/UserAtom";
import UseAuth from "../../../../../lib/hooks/UseAuth";
import { Domain, FirebaseUrl } from "../../../../../lib/Domain";
import Image from "next/image";
import { motion } from "framer-motion";
import { HeroHighlight } from "@/components/ui/hero-highlight";

const Page = () => {
    const { loading, authenticated } = UseAuth();
    const [userId] = useAtom(userAtom);
    const router = useRouter();
    useEffect(() => {
        if (!userId && !loading) {
            router.push("/auth/signin");
        }
    }, [userId, loading, router]);
    const [DataLoading, setDataloading] = useState<boolean>(false);
    const [startupRender, setstartupRender] = useState<boolean>(true);
    const [CreateIdeaCard, setCreateIdeaCard] = useState<boolean>(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [ideaData, setIdeadata] = useState<Ideas>();
    const [roomData, setroomdata] = useState<Rooms>();
    const [roomId, setroomId] = useState<string>();
    const [ideaSubmitted, setideaSubmitted] = useState<boolean>(false);
    const [InputUpdate, setInputUpdate] = useState<string>("");
    const [imagelink, setimagelink] = useState<string[]>([]);
    const [videolink, setvideolink] = useState<string[]>([]);
    const [update_list, setupdate_list] = useState<update[]>([]);
    const [activeTab, setActiveTab] = useState<
        "requests" | "members" | "settings" | null
    >(null);
    const [ClickFinalProject, setClickFinalProject] = useState<boolean>(false);
    const [showProjectSubmit, setShowProjectSubmit] = useState(false);
    const submitref = useRef<HTMLButtonElement>(null);
    const { toast } = useToast();
    const pathname = usePathname();
    const parts = pathname.split("/");
    const { notifications, error } = useFirebaseNotifications(`${FirebaseUrl}`);

    useEffect(() => {
        if (userId === "d0e358f6-c0c7-41a0-8f4a-2687967431ad") {
            router.push("/institution");
        }
        const roomIdFromPath = parts[2];
        if (roomIdFromPath && roomIdFromPath !== roomId) {
            setroomId(roomIdFromPath);
        }
        console.log(roomId);
    }, [pathname, roomId, userId, router, parts]);

    useEffect(() => {
        const fetchIdeaData = async () => {
            try {
                setDataloading(true);
                // toast({
                //     title: "Data is Fetching",
                //     description:
                //         "Due to heavy traffic, delay is there to retrieve data from server.",
                // });
                const ideaData = await axios.get(
                    `${Domain}/api/v1/idea/get-idea`,
                    {
                        params: {
                            roomId: roomId,
                        },
                    }
                );
                const roomData = await axios.get(
                    `${Domain}/api/v1/room/get-room-data`,
                    {
                        params: {
                            roomId: roomId,
                        },
                    }
                );
                console.log("hello", roomData);
                setIdeadata(ideaData.data.data);
                setroomdata(roomData.data.data);

                console.log(roomData.data.data.update);
                setupdate_list(roomData.data.data.update);

                // toast({
                //     title: "Data is Fetched",
                //     description: "Continue your work",
                // });
                setDataloading(false);
            } catch (error) {
                toast({
                    title: "Error Fetching Data",
                    description:
                        "Unable to retrieve data. Please try again later.",
                });
            }
        };
        if (roomId) {
            fetchIdeaData();
        }
    }, [roomId, notifications, toast,setideaSubmitted]);

    useEffect(() => {
        if (ideaData) {
            setstartupRender(false);
            setideaSubmitted(true);
        }
    }, [ideaData]);
    const CreateButtonHandlerStartup = async () => {
        setIsFadingOut(true);
        setstartupRender(false);
        setCreateIdeaCard(true);
        setIsFadingOut(false); // Reset a
    };
    const SubmitUpdate = async () => {
        try {
            const UpdateData = await axios.post(
                `${Domain}/api/v1/update/create`,
                {
                    update_text: InputUpdate,
                    image_link: imagelink,
                    video_link: videolink,
                    author_id: userId,
                    roomId: roomId,
                }
            );
            if (UpdateData) {
                setInputUpdate("");
                console.log(UpdateData);
                setupdate_list([...update_list, UpdateData.data.data]);
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        console.log(update_list);
    }, [update_list]);

    return (
        <div className="w-full h-full flex flex-col justify-start items-start  overflow-hidden">
            <HeroHighlight className="w-full h-full flex flex-col justify-start items-start  overflow-hidden">

            <div className="absolute top-[70px] left-[300px]">
                {DataLoading && <Loader2 className="  w-4 h-4 animate-spin" />}
            </div>
            <div className="w-full h-full overflow-y-scroll">
                <div className="flex justify-between items-center w-full p-4">
                    <div className="flex gap-1 justify-center items-center z-10 text-3xl font-extrabold">
                        {roomData && roomData.room_name}
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Room Options</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56">
                            <div className="flex flex-col space-y-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => submitref.current?.click()}
                                >
                                    <List className="mr-2 h-4 w-4" />
                                    Submit Final Project
                                </Button>
                                {userId === roomData?.owner_id && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setActiveTab("requests")}
                                    >
                                        <List className="mr-2 h-4 w-4" />
                                        Request List
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab("members")}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Member List
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab("settings")}
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                {activeTab === "requests" &&
                    roomId &&
                    userId === roomData?.owner_id && <RequestList />}
                {activeTab === "members" && <MemberList />}
                {activeTab === "settings" && (
                    <div>Settings Component (to be implemented)</div>
                )}
                {startupRender && (
                    <div className="relative w-full min-h-[600px] flex items-center justify-center p-8 bg-transparent overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{
                                opacity: isFadingOut ? 0 : 1,
                                scale: isFadingOut ? 0.95 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-3xl"
                        >
                            <div className="relative group rounded-xl bg-zinc-900/50 border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-violet-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative flex flex-col items-center gap-6 text-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 10,
                                        }}
                                        className="p-4 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/20"
                                    >
                                        <LightbulbIcon className="w-16 h-16 text-yellow-400" />
                                    </motion.div>

                                    <h1 className="font-extrabold text-4xl md:text-5xl bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                                        Initialize Journey by Posting Idea
                                    </h1>

                                    <p className="text-neutral-300 max-w-xl text-lg">
                                        If you are looking to submit your
                                        project, the first step is to present
                                        your idea. Without a clear idea, your
                                        project lacks direction and purpose.
                                    </p>

                                    <Button
                                        onClick={CreateButtonHandlerStartup}
                                        className="relative group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                                    >
                                        <span className="relative z-10">
                                            Create Idea
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 rounded-xl blur-xl transition-opacity duration-300" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
                {CreateIdeaCard && setideaSubmitted && userId && (
                    <div className="flex w-full h-full flex-col justify-center items-center">
                        <div className="flex items-center flex-col h-full lg:max-h-[calc(100vh-60px)]">
                            <div className="text-[40px] font-serif m-10">
                                Idea Submission
                            </div>
                            <div className="w-[100%] h-full opacity-100 animate-fadeIn">
                                <Formdata_ setSubmitted={setideaSubmitted} userId={userId} roomId={roomId}/>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-full   flex justify-start items-center pt-4 flex-col">
                    {ideaSubmitted && (
                        <div className="flex flex-col w-[90%] h-auto gap-5 border-2 p-6 rounded-lg glass-effect">
                            <div className="text-[40px]">
                                <p className={roboto.className}>Idea</p>
                            </div>
                            <div className="font-extrabold text-3xl">
                                {ideaData?.idea_name}
                            </div>
                            <div className="px-3 py-2">
                                {ideaData?.idea_text}
                            </div>
                            <div className="px-4 text-blue-500">
                                <div className="flex w-full">
                                    {ideaData?.image_link &&
                                        ideaData.image_link.map(
                                            (link: string, index: number) => {
                                                return (
                                                    <Image
                                                        alt="Image"
                                                        width={50}
                                                        height={0}
                                                        layout="responsive"
                                                        className="w-[60px]"
                                                        key={index}
                                                        src={link}
                                                    />
                                                );
                                            }
                                        )}
                                    {ideaData?.video_link &&
                                        ideaData.video_link.map(
                                            (link: string, index: number) => {
                                                return (
                                                    <video
                                                        className="w-[130px]"
                                                        autoPlay
                                                        key={index}
                                                        src={link}
                                                    />
                                                );
                                            }
                                        )}
                                </div>
                                {ideaData?.usefull_links &&
                                Array.isArray(ideaData.usefull_links) ? (
                                    ideaData.usefull_links.map(
                                        (link: string, index: number) => (
                                            <a
                                                key={index}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:border-b border-blue-500 cursor-pointer w-auto"
                                            >
                                                {link}
                                            </a>
                                        )
                                    )
                                ) : (
                                    <p></p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="w-full flex flex-col pb-[120px]">
                        {/* {update_list &&
                        update_list.map((update_data: project_update,index) => {
                            if(userId===update_data.author_id){
                                return(
                                    <div className="w-full flex justify-end" key={index}>
                                        <div className="border-2 p-5 m-3">
                                        <div className="text-lg font-semibold">
                                            {update_data?.text}
                                        </div>
                                        <div className="flex ">
                                            {
                                                update_data.image_link && update_data.image_link.map((image,index)=>{
                                                    return(
                                                        <img src={image} alt="" key={index}/>
                                                    )
                                                })
                                            }
                                        </div>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                            <div className="w-full flex justify-start">
                                {update_data?.text}
                            </div>
                            );
                        })} */}
                        {update_list && userId && (
                            <ProjectUpdates
                                updateList={update_list}
                                currentUserId={userId}
                            />
                        )}
                    </div>
                </div>
                {ideaData && (
                    <div className="absolute bottom-0 right-0  w-screen lg:w-[calc(100vw-760px)] md:w-[calc(100vw-400px)] pb-8 pr-8 flex justify-center items-center">
                        <TextInputWithCloudinary
                            onTextareaChange={(value) => {
                                console.log(value);

                                setInputUpdate(value);
                            }}
                            textareaValue={InputUpdate}
                            setImageMediaLinks={setimagelink}
                            setVideoMediaLinks={setvideolink}
                        />
                        <Button
                            className="absolute bottom-0 right-0  mb-14 mr-12"
                            onClick={SubmitUpdate}
                        >
                            <Upload />
                        </Button>
                    </div>
                )}
                {ideaData && !showProjectSubmit && (
                    <div className=" hidden fixed bottom-[200px] right-[40%] z-50">
                        <Button
                            ref={submitref}
                            onClick={() => setShowProjectSubmit(true)}
                        >
                            Submit Final Project
                        </Button>
                    </div>
                )}
                {showProjectSubmit && (
                    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-card rounded-lg shadow-lg overflow-auto max-h-[90vh] w-[90vw] max-w-4xl">
                            <ChatBasedProjectSubmit />
                            <Button
                                className="absolute top-5 right-5"
                                onClick={() => setShowProjectSubmit(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            </HeroHighlight>

        </div>
    );
};
export default Page;

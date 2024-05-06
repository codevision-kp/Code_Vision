'use client';
import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  ScreenShareButton
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const [startcoding,setStartCoding] = useState(false);
  const openExternalLink = () => {
    // Replace 'https://example.com' with the URL of the external website
    const externalUrl = 'https://editor-blue-seven.vercel.app/';
    
    // window.open(externalUrl, '_blank'); // '_blank' opens in a new tab
};
  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  const WebsiteEmbed = ({ url }) => {
    return (
      <div style={{ width: '100%', height: '85%' }}>
        <iframe
          src={url}
          title="Embedded Website"
          width="100%"
          height="100%"
          frameBorder="0"
        />
      </div>
    );
  };
  if (callingState !== CallingState.JOINED) return <Loader />;
  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };
  return (
    
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
     
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full justify-center items-center">
         {startcoding? 
          <div className=' flex size-full items-center mb-5'>
          <WebsiteEmbed url={'https://editor-blue-seven.vercel.app/'} />
          </div>
          :
          <div className=' flex size-full max-w-[1000px] items-center'> 
          <CallLayout />
          </div>
          }
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
      <Button className="bg-blue-1 "  onClick={() => {setStartCoding(!startcoding)}}>
         {!startcoding? <div>
          Start Coding
          </div>
          :
          <div>
          End Coding
          </div>
          }
          <div className='absolute flex' style={{opacity:'0'}}>
          <ScreenShareButton/>
          <ScreenShareButton/>
          <ScreenShareButton/>
          </div>
        </Button>
        
        
        <CallControls onLeave={() => router.push(`/`)} />
      
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;

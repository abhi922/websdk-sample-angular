import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from "@angular/router";

import { ZoomMtg } from '@zoomus/websdk';


@Component({
    selector: 'new-meeting',
    templateUrl: './newmeeting.component.html',
    styleUrls: ['./newmeeting.component.css']
})
export class NewMeetingComponent implements OnInit {

    // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
    signatureEndpoint = ''
    apiKey = ''
    meetingNumber = 123456789
    role = 0
    leaveUrl = 'http://localhost:4200'
    userName = 'Angular'
    userEmail = ''
    passWord = ''

    constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(p => {
            console.log(p);
        });
    }

    getSignature() {
        this.httpClient.post(this.signatureEndpoint, {
            meetingNumber: this.meetingNumber,
            role: this.role
        }).toPromise().then((data: any) => {
            if (data.signature) {
                console.log(data.signature)
                this.startMeeting(data.signature)
            } else {
                console.log(data)
            }
        }).catch((error) => {
            console.log(error)
        })
    }

    startMeeting(signature) {

        document.getElementById('zmmtg-root').style.display = 'block'

        ZoomMtg.init({
            leaveUrl: this.leaveUrl,
            isSupportAV: true,
            success: (success) => {
                console.log(success)

                ZoomMtg.join({
                    signature: signature,
                    meetingNumber: this.meetingNumber,
                    userName: this.userName,
                    apiKey: this.apiKey,
                    userEmail: this.userEmail,
                    passWord: this.passWord,
                    success: (success) => {
                        console.log(success)
                    },
                    error: (error) => {
                        console.log(error)
                    }
                })

            },
            error: (error) => {
                console.log(error)
            }
        })
    }
}
